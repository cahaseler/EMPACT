BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] DROP CONSTRAINT [AssessmentUserResponse_levelId_fkey];

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Level'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Level] (
    [id] INT NOT NULL,
    [shortDescription] VARCHAR(max) NOT NULL,
    [longDescription] VARCHAR(max) NOT NULL,
    [level] INT NOT NULL,
    [weight] INT NOT NULL,
    [attributeId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Level_pkey] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[Level])
    EXEC('INSERT INTO [dbo].[_prisma_new_Level] ([attributeId],[id],[level],[longDescription],[shortDescription],[weight]) SELECT [attributeId],[id],[level],[longDescription],[shortDescription],[weight] FROM [dbo].[Level] WITH (holdlock tablockx)');
DROP TABLE [dbo].[Level];
EXEC SP_RENAME N'dbo._prisma_new_Level', N'Level';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentUserResponse] ADD CONSTRAINT [AssessmentUserResponse_levelId_fkey] FOREIGN KEY ([levelId]) REFERENCES [dbo].[Level]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
