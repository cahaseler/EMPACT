BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[SystemRole] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SystemRole_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SystemRole_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Assessment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [projectId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [location] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [assessmentCollectionId] INT,
    CONSTRAINT [Assessment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ScoreSummary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [score] INT NOT NULL,
    [assessmentId] INT,
    CONSTRAINT [ScoreSummary_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentCollection] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [assessmentTypeId] INT NOT NULL,
    CONSTRAINT [AssessmentCollection_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AssessmentCollection_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role] NVARCHAR(1000) NOT NULL,
    [assessmentId] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [AssessmentUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    CONSTRAINT [AssessmentType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AssessmentType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Part] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [assessmentTypeId] INT NOT NULL,
    CONSTRAINT [Part_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Section] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [partId] INT NOT NULL,
    CONSTRAINT [Section_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Attribute] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [sectionId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Attribute_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Level] (
    [id] INT NOT NULL IDENTITY(1,1),
    [shortDescription] VARCHAR(max) NOT NULL,
    [longDescription] VARCHAR(max) NOT NULL,
    [level] INT NOT NULL,
    [weight] INT NOT NULL,
    [attributeId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Level_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentUserResponse] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [assessmentId] INT NOT NULL,
    [attributeId] NVARCHAR(1000) NOT NULL,
    [levelId] INT NOT NULL,
    [notes] VARCHAR(max) NOT NULL,
    CONSTRAINT [AssessmentUserResponse_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Settings] (
    [id] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [Settings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[WhiteLabeling] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organizationName] NVARCHAR(1000) NOT NULL,
    [logoUrl] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [WhiteLabeling_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_SystemRoleToUser] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_SystemRoleToUser_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_SystemRoleToUser_B_index] ON [dbo].[_SystemRoleToUser]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Assessment] ADD CONSTRAINT [Assessment_assessmentCollectionId_fkey] FOREIGN KEY ([assessmentCollectionId]) REFERENCES [dbo].[AssessmentCollection]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ScoreSummary] ADD CONSTRAINT [ScoreSummary_assessmentId_fkey] FOREIGN KEY ([assessmentId]) REFERENCES [dbo].[Assessment]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentCollection] ADD CONSTRAINT [AssessmentCollection_assessmentTypeId_fkey] FOREIGN KEY ([assessmentTypeId]) REFERENCES [dbo].[AssessmentType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUser] ADD CONSTRAINT [AssessmentUser_assessmentId_fkey] FOREIGN KEY ([assessmentId]) REFERENCES [dbo].[Assessment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUser] ADD CONSTRAINT [AssessmentUser_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Part] ADD CONSTRAINT [Part_assessmentTypeId_fkey] FOREIGN KEY ([assessmentTypeId]) REFERENCES [dbo].[AssessmentType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Section] ADD CONSTRAINT [Section_partId_fkey] FOREIGN KEY ([partId]) REFERENCES [dbo].[Part]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Attribute] ADD CONSTRAINT [Attribute_sectionId_fkey] FOREIGN KEY ([sectionId]) REFERENCES [dbo].[Section]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Level] ADD CONSTRAINT [Level_attributeId_fkey] FOREIGN KEY ([attributeId]) REFERENCES [dbo].[Attribute]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] ADD CONSTRAINT [AssessmentUserResponse_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] ADD CONSTRAINT [AssessmentUserResponse_assessmentId_fkey] FOREIGN KEY ([assessmentId]) REFERENCES [dbo].[Assessment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] ADD CONSTRAINT [AssessmentUserResponse_attributeId_fkey] FOREIGN KEY ([attributeId]) REFERENCES [dbo].[Attribute]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] ADD CONSTRAINT [AssessmentUserResponse_levelId_fkey] FOREIGN KEY ([levelId]) REFERENCES [dbo].[Level]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_SystemRoleToUser] ADD CONSTRAINT [_SystemRoleToUser_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[SystemRole]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_SystemRoleToUser] ADD CONSTRAINT [_SystemRoleToUser_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
