// No "use client" here - this is a Server Component

import { auth, clerkClient } from "@clerk/nextjs/server"; // Keep server imports here
import { redirect } from "next/navigation";
import type { User as ClerkUser, EmailAddress } from "@clerk/backend";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
// Remove client-side imports like Checkbox, Label, useState, useEffect, useMemo
import {
 isAdmin,
 isLeadForAssessment,
 isFacForAssessment,
} from "@/app/(frontend)/(logged-in)/utils/permissions";
import NotFound from "@/app/(frontend)/components/notFound";
import { db } from "@/lib/db";
import { DataTable } from "./data-table";
import { columns, type AssessmentUserDashboardData } from "./columns";
// Import the type needed for casting, ProgressTable itself is not rendered directly here
import { type AssessmentUserWithDetails } from "./ProgressTable";
import type { PrismaClient as PrismaTypes } from '@/lib/db';
import { DashboardClientUI } from './DashboardClientUI'; // Import the new Client Component

interface FacilitatorDashboardPageProps {
  readonly params: {
    assessmentGroupId: string;
    assessmentId: string;
  };
}

// Keep the original data fetching logic
async function getData(params: FacilitatorDashboardPageProps['params']) {
  const authResult = await auth(); // Needs await
  const sessionClaims = authResult.sessionClaims;

  const assessmentId = parseInt(params.assessmentId); // No need for await params

  if (!sessionClaims) {
    redirect("/sign-in");
  }
  // Permissions check
  const metadata = sessionClaims?.metadata;
  const isUserAdmin = isAdmin(metadata ? { user: metadata } : null);
  const isUserLead = isLeadForAssessment(metadata ? { user: metadata } : null, assessmentId.toString());
  const isUserFac = isFacForAssessment(metadata ? { user: metadata } : null, assessmentId.toString());
  const isAuthorized = isUserAdmin || isUserLead || isUserFac;

  if (!isAuthorized) {
    return null; // Return null if not authorized
  }

  // Fetch assessment data
  const assessment = await db.assessment.findUniqueOrThrow({
    where: { id: assessmentId },
    include: {
      assessmentCollection: {
        include: {
          assessmentTypes: true,
        },
      },
    },
  });

  const assessmentParts = await db.assessmentPart.findMany({
    where: { assessmentId: assessmentId },
    include: { part: true },
    orderBy: { part: { name: 'asc' } },
  });

  const assessmentUserGroups = await db.assessmentUserGroup.findMany({
    where: { assessmentId: assessmentId },
    orderBy: { name: 'asc' },
  });

  // Fetch AssessmentUsers with necessary relations for BOTH tables
  const assessmentUsers = await db.assessmentUser.findMany({
    where: { assessmentId: assessmentId },
    include: {
      user: { select: { firstName: true, id: true, lastName: true, email: true } },
      assessmentUserGroup: true // Needed for AssessmentUserWithDetails type
    },
    orderBy: { user: { email: 'asc' } },
  });

  // Fetch Attributes (no DB sort)
  const assessmentAttributes = await db.assessmentAttribute.findMany({
    where: { assessmentId: assessmentId }
  });

  // Fetch ALL Responses
  const allAssessmentUserResponses = await db.assessmentUserResponse.findMany({
    where: { assessmentId: assessmentId },
  });

  // --- Clerk User Data Fetching ---
  const userEmails = assessmentUsers
    .map((au) => au.user?.email)
    .filter((email): email is string => typeof email === 'string' && email !== '');

  type ClerkUserData = { clerkUserId: string; lastSignInAt: Date | null; signInMethod: string; };
  const clerkUserDataMap = new Map<string, ClerkUserData>();

  if (userEmails.length > 0) {
    try {
      const client = await clerkClient(); // Needs await
      const clerkUsers = await client.users.getUserList({ emailAddress: userEmails });
      for (const clerkUser of clerkUsers.data) {
        let signInMethod = "Unknown";
        if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) signInMethod = "PARS";
        else if (clerkUser.passwordEnabled) signInMethod = "Email";
        const lastSignInDate = typeof clerkUser.lastSignInAt === 'number' ? new Date(clerkUser.lastSignInAt) : null;
        const userDataPayload = { clerkUserId: clerkUser.id, lastSignInAt: lastSignInDate, signInMethod: signInMethod };
        for (const email of clerkUser.emailAddresses) {
          if (email.emailAddress && email.verification?.status === 'verified') {
             clerkUserDataMap.set(email.emailAddress.toLowerCase(), userDataPayload);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Clerk user data by email:", error);
    }
  }
  // --- End Clerk User Data Fetching ---

  // --- Users Table Data Prep ---
   const latestResponseMap = new Map<number, string>()
   const userIds = assessmentUsers.map((au) => au.userId).filter((id): id is number => id !== null);
   if (userIds.length > 0) {
     const responsesForLatest = await db.assessmentUserResponse.findMany({
       where: { assessmentId: assessmentId, userId: { in: userIds } },
       select: { userId: true, attributeId: true, id: true },
       orderBy: { id: 'asc' },
     });
     for (const response of responsesForLatest) {
       // Ensure userId is not null before setting in the map
       if (response.userId !== null) {
         latestResponseMap.set(response.userId, response.attributeId);
       }
     }
   }

  const usersTableData: AssessmentUserDashboardData[] = assessmentUsers.map((assessmentUser) => {
    const firstName = assessmentUser.user?.firstName ?? '';
    const lastName = assessmentUser.user?.lastName ?? '';
    const name = `${firstName} ${lastName}`.trim() || '';
    // Ensure userId is not null before getting from the map
    const lastCompletedAttributeId = assessmentUser.userId !== null ? latestResponseMap.get(assessmentUser.userId) ?? '' : '';
    const userEmail = assessmentUser.user?.email;
    const clerkData = userEmail ? clerkUserDataMap.get(userEmail.toLowerCase()) : undefined;
    return {
      id: assessmentUser.id,
      prismaUserId: assessmentUser.userId,
      clerkUserId: clerkData?.clerkUserId ?? null,
      name: name,
      email: userEmail ?? '',
      role: assessmentUser.role,
      group: assessmentUser.assessmentUserGroup?.name ?? '',
      lastCompletedAttributeId: lastCompletedAttributeId,
      lastSignInAt: clerkData?.lastSignInAt ?? null,
      signInMethod: clerkData ? (clerkData.signInMethod !== 'Unknown' ? clerkData.signInMethod : 'Email') : '',
    };
  });
  // --- End Users Table Data Prep ---


  // Custom sort function for attribute IDs
  const sortAttributeIds = (a: { attributeId: string }, b: { attributeId: string }) => {
    const aHasPeriod = a.attributeId.includes('.');
    const bHasPeriod = b.attributeId.includes('.');
    if (aHasPeriod && !bHasPeriod) return 1;
    if (!aHasPeriod && bHasPeriod) return -1;
    return a.attributeId.localeCompare(b.attributeId, undefined, { numeric: true, sensitivity: 'base' });
  };

  // Sort the fetched attributes using the custom function
  const sortedAssessmentAttributes = [...assessmentAttributes].sort(sortAttributeIds);

  return {
    assessment,
    assessmentParts,
    assessmentUserGroups,
    assessmentUsers, // Pass the raw users with details including relations
    sortedAssessmentAttributes,
    allAssessmentUserResponses,
    usersTableData
  };
}


export default async function FacilitatorDashboardPage({ params }: FacilitatorDashboardPageProps) {
  // Fetch data on the server
  const data = await getData(params);

  // If data is null (unauthorized), render NotFound
  if (!data) {
    return <NotFound pageType="dashboard" />;
  }

  // Destructure data for clarity
  const {
    assessment,
    assessmentParts,
    assessmentUserGroups,
    assessmentUsers,
    sortedAssessmentAttributes,
    allAssessmentUserResponses,
    usersTableData
  } = data;

  // The assessmentUsers fetched includes the 'user' and 'assessmentUserGroup' relations
  // We can safely cast it here when passing to the client component
  const assessmentUsersForClient = assessmentUsers as AssessmentUserWithDetails[];

  return (
     <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Facilitator Dashboard - {assessment.name}</h1>

      {/* --- Original Static Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Assessment</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Type:</strong> {assessment.assessmentCollection?.assessmentTypes.name ?? ''}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={assessment.status === 'Inactive' ? "text-red-600" : ""}>
                  {assessment.status}
                </span>
              </p>
              <p><strong>Completed Date:</strong> {assessment.completedDate?.toLocaleDateString() ?? ''}</p>
            </div>
          </CardContent>
         </Card>

        <Card>
          <CardHeader><CardTitle>Assessment Parts</CardTitle></CardHeader>
          <CardContent>
            {assessmentParts.length > 0 ? (
              <ul className="space-y-2">
                {assessmentParts.map((assessmentPart: PrismaTypes.AssessmentPart & { part: PrismaTypes.Part }) => (
                  <li key={assessmentPart.id} className="flex justify-between">
                    <span>{assessmentPart.part.name}</span>
                    <span className={assessmentPart.status === 'Inactive' ? "text-red-600 font-semibold" : ""}>
                      {assessmentPart.status ?? ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No parts found for this assessment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assessment User Groups</CardTitle></CardHeader>
          <CardContent>
            {assessmentUserGroups.length > 0 ? (
              <ul className="space-y-2">
                {assessmentUserGroups.map((group: PrismaTypes.AssessmentUserGroup) => (
                  <li key={group.id} className="flex justify-between">
                    <span>{group.name}</span>
                    <span className={group.status === 'Inactive' ? "text-red-600 font-semibold" : ""}>
                      {group.status ?? ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No user groups found for this assessment.</p>
            )}
          </CardContent>
        </Card>

        {/* --- Original Users Table (in Accordion) --- */}
        <Card className="md:col-span-3">
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Assessment Users (Details)</AccordionTrigger>
                <AccordionContent>
                  {usersTableData.length > 0 ? (
                    <DataTable columns={columns} data={usersTableData} />
                  ) : (
                    <p>No users found for this assessment.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* --- Client Component for Filters + Progress Table --- */}
      <DashboardClientUI
        initialAssessmentUsers={assessmentUsersForClient} // Pass correctly typed data
        initialSortedAttributes={sortedAssessmentAttributes}
        initialUserResponses={allAssessmentUserResponses}
      />

    </div>
  );
}