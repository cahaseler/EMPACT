BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AssessmentCollectionUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role] NVARCHAR(1000) NOT NULL,
    [assessmentCollectionId] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [AssessmentCollectionUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentCollectionUser] ADD CONSTRAINT [AssessmentCollectionUser_assessmentCollectionId_fkey] FOREIGN KEY ([assessmentCollectionId]) REFERENCES [dbo].[AssessmentCollection]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentCollectionUser] ADD CONSTRAINT [AssessmentCollectionUser_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Level] ADD CONSTRAINT [Level_attributeId_fkey] FOREIGN KEY ([attributeId]) REFERENCES [dbo].[Attribute]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
