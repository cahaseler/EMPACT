import { auth } from "@clerk/nextjs/server";
import { AssessmentCollectionUser, AssessmentUser, SystemRole } from "@/auth";

export async function DebugSessionInfo() {
  if (!(process.env.SHOW_DEBUG_SESSION_INFO === "true")) return null

  const session = await auth()
  const sessionClaims = session?.sessionClaims as CustomJwtSessionClaims

  if (!sessionClaims) return null

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <div className="group relative">
        {/* Button-shaped trigger */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors">
          Show Session Claims
        </button>

        {/* Hover-expandable content */}
        <div className="absolute bottom-full right-0 mb-2 w-96 max-h-[80vh] overflow-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 p-4 transform scale-y-0 origin-bottom opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all duration-200">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
            Session Claims
          </h3>

          {/* User section */}
          <div className="mb-4">
            <h4 className="font-medium text-md text-gray-800 dark:text-gray-200 mb-1">
              Clerk Data
            </h4>
            <div className="pl-2 border-l-2 border-blue-500 space-y-1">
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  ID:
                </span>{" "}
                {sessionClaims.user?.id || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email:
                </span>{" "}
                {sessionClaims.user?.email || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </span>{" "}
                {sessionClaims.user?.name || "N/A"}
              </p>
              {sessionClaims.user?.first_name && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    First Name:
                  </span>{" "}
                  {sessionClaims.user.first_name}
                </p>
              )}
              {sessionClaims.user?.last_name && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Last Name:
                  </span>{" "}
                  {sessionClaims.user.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Metadata section */}
          <div>
            <h4 className="font-medium text-md text-gray-800 dark:text-gray-200 mb-1">
              Metadata populated from SQL
            </h4>
            <div className="pl-2 border-l-2 border-green-500 space-y-1">
              {/* Database ID */}
              {sessionClaims.metadata?.databaseId !== undefined && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ID in Users Table:
                  </span>{" "}
                  {sessionClaims.metadata.databaseId}
                </p>
              )}

              {/* System Roles */}
              {sessionClaims.metadata?.systemRoles &&
                sessionClaims.metadata.systemRoles.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      System Roles:
                    </p>
                    <ul className="list-disc list-inside pl-2">
                      {sessionClaims.metadata.systemRoles.map(
                        (role: SystemRole, index: number) => (
                          <li
                            key={index}
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            {JSON.stringify(role)}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Assessment Collection Users */}
              {sessionClaims.metadata?.assessmentCollectionUser &&
                sessionClaims.metadata.assessmentCollectionUser.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assessment Collection Users:
                    </p>
                    <div className="pl-2 text-xs text-gray-600 dark:text-gray-400">
                      {sessionClaims.metadata.assessmentCollectionUser.map(
                        (user: AssessmentCollectionUser, index: number) => (
                          <details key={index} className="mb-1">
                            <summary className="cursor-pointer">
                              Collection User {index + 1}
                            </summary>
                            <pre className="mt-1 p-1 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                              {JSON.stringify(user, null, 2)}
                            </pre>
                          </details>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Assessment Users */}
              {sessionClaims.metadata?.assessmentUser &&
                sessionClaims.metadata.assessmentUser.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assessment Users:
                    </p>
                    <div className="pl-2 text-xs text-gray-600 dark:text-gray-400">
                      {sessionClaims.metadata.assessmentUser.map(
                        (user: AssessmentUser, index: number) => (
                          <details key={index} className="mb-1">
                            <summary className="cursor-pointer">
                              Assessment User {index + 1}
                            </summary>
                            <pre className="mt-1 p-1 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                              {JSON.stringify(user, null, 2)}
                            </pre>
                          </details>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
