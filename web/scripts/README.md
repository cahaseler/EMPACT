# IP2M METRR Data Import Utility

This utility imports legacy assessment data from the IP2M METRR system into EMPACT. It was created to migrate historical assessment data while preserving all responses and maintaining data integrity.

## Usage

```bash
# Dry run (preview what will be imported)
yarn import:ip2m --file="path/to/excel-file.xlsx" --dryRun

# Actual import
yarn import:ip2m --file="path/to/excel-file.xlsx"
```

## Excel File Format Specification

The Excel file must contain exactly two sheets with specific column structures:

### Sheet 1: `assessment`

This sheet contains assessment metadata. Expected columns:

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `id` | number | Legacy assessment ID (not used) | 130 |
| `project_id` | string | Project identifier | "LCCF" |
| `name` | string | Assessment name | "LCCF EVMS Review" |
| `type_id` | number | Legacy type ID (not used) | 16 |
| `type` | string | Legacy type name (not used) | "NSF Project" |
| `location` | string | Assessment location | "Austin, Texas" |
| `date` | number | JavaScript timestamp (milliseconds since epoch) | 1729712460000 |
| `manager` | string | Manager name (not used) | "" |
| `description` | string | Assessment description (can contain HTML) | "" |
| `hide_description` | boolean | (not used) | true |
| `status` | string | Assessment status: "STARTED", "COMPLETED", etc. | "STARTED" |
| `has_maturity` | boolean | (not used) | false |
| `has_environment` | boolean | (not used) | true |
| `maturity_score` | number | Maturity score (if available) | 842 |
| `current_progress` | string | (not used) | "IN_PROGRESS" |
| `percent_completed` | number | (not used) | 0 |
| `maturity_progress` | string | (not used) | "COMPLETED" |
| `env_progress` | string | (not used) | "COMPLETED" |
| `is_env_anonymous` | boolean | (not used) | true |
| `lock_env` | boolean | (not used) | false |
| `internal_assessment_status` | string | (not used) | "ACTIVE" |
| `factor_facilitator_answers` | boolean | (not used) | false |
| `environment_score` | number | Environment score (if available) | 926 |

### Sheet 2: `assessment_user_responses`

This sheet contains all user responses. Expected columns:

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `id` | number | Legacy response ID | 18030 |
| `user_id` | number | Legacy user ID | 381 |
| `attribute_id` | string | EMPACT attribute ID | "1a" |
| `level_id` | number | Legacy level ID (not used directly) | 340 |
| `notes` | string | Response notes (can contain HTML) | "<p>project saying...</p>" |
| `section_id` | string | Section ID for validation | "1" |
| `is_facilitator_response` | boolean | (not used) | false |
| `attributes.name` | string | Attribute name (for reference) | "The contractor organization..." |
| `attributes.description` | string | Attribute description (for reference) | "<p>The contractor's...</p>" |
| `levels.short_description` | string | Level short description | "Meets Most" |
| `levels.long_description` | string | Level long description | "Rating a factor..." |
| `levels.level_number` | number | Level number (1-5) - CRITICAL for mapping | 4 |
| `levels.weight` | number | Level weight/score | 58 |
| `sections.name` | string | Section name | "Culture" |
| `sections.description` | string | Section description | "The culture category..." |

## Import Process

The import utility performs the following steps:

### 1. Validation Phase
- Verifies IP2M METRR assessment type exists in EMPACT
- Validates all attribute IDs from responses exist in EMPACT
- Maps legacy level numbers to EMPACT level IDs
- Checks for existing data to prevent duplicates

### 2. Import Phase (in transaction)
For each assessment in the Excel file:

1. **Create Assessment Collection**
   - Name: "Import - [Assessment Name]"
   - Type: IP2M METRR

2. **Create Assessment**
   - Project ID, name, location from Excel
   - Status mapping:
     - "STARTED" → "Active"
     - "COMPLETED" → "Final"
     - "NOT_STARTED" → "Inactive"
   - Completed date set if status is "COMPLETED"
   - HTML cleaned from description

3. **Create Assessment Parts**
   - Creates parts for Environment and Maturity
   - Status: "Active"
   - Date from Excel timestamp

4. **Add Assessment Attributes**
   - Links all 83 IP2M METRR attributes to assessment

5. **Create User Group**
   - Name: "Imported Participants"
   - Status: "Active"

6. **Create/Find Users**
   - Email format: `imported_ip2m_user_{legacy_id}@doe.gov`
   - Name: "IP2M User {legacy_id}"
   - Checks for existing users to avoid duplicates

7. **Create Assessment Users**
   - Role: "Participant"
   - Linked to user group
   - Connected to all assessment parts
   - No permissions (not real users)

8. **Import Responses**
   - Maps attribute IDs directly
   - Maps level numbers to EMPACT level IDs
   - Cleans HTML from notes
   - Creates AssessmentUserResponse records

### 3. Post-Import Notes
- Score summaries are skipped due to database schema mismatch
- All operations occur in a transaction (all-or-nothing)
- 60-second timeout for large imports

## Data Mapping Details

### Status Mapping
```
Excel Status    →  EMPACT Status
STARTED         →  Active
COMPLETED       →  Final  
NOT_STARTED     →  Inactive
ACTIVE          →  Active
INACTIVE        →  Inactive
FINAL           →  Final
ARCHIVED        →  Archived
(default)       →  Active
```

### Level Mapping
Levels are mapped using the combination of attribute ID and level number:
- Key: `{attribute_id}-{level_number}` (e.g., "1a-4")
- Maps to EMPACT level ID

### HTML Cleaning
Basic HTML tags and entities are removed from:
- Assessment descriptions
- Response notes

Conversions:
- `<p>`, `</p>`, etc. → removed
- `&nbsp;` → space
- `&rsquo;` → '
- `&ldquo;` → "
- `&rdquo;` → "
- `&amp;` → &

## Prerequisites

1. **IP2M METRR Assessment Type** must exist in EMPACT database
2. **All Attributes** referenced in responses must exist in EMPACT
3. **All Levels** must exist for each attribute (levels 0-5)
4. **Database Access** with write permissions

## Error Handling

- **Validation Errors**: Stop before import if data doesn't match
- **Duplicate Users**: Reuses existing imported users
- **Duplicate Assessment Users**: Logs warning but continues
- **Missing Level Mappings**: Logs error and skips that response
- **Transaction Rollback**: All changes reverted if any error occurs

## Output

The import provides detailed progress information:
```
📊 Starting IP2M METRR Data Import
✅ IP2M METRR Assessment type found (ID: 1)
✅ All 83 attributes validated
📁 Processing assessment: LCCF EVMS Review
  ✅ Created assessment (ID: 15)
  ✅ Created 2 assessment parts
  ✅ Added 83 attributes to assessment
  ✅ Created user group for imported participants
  ✅ Created user: imported_ip2m_user_381@doe.gov
  ✅ Processed 16 users
  ✅ Imported 466 responses
🎉 Import completed successfully!
```

## Troubleshooting

### "IP2M METRR assessment type not found"
The IP2M METRR assessment type doesn't exist in the database. This is required base data.

### "Missing attributes in EMPACT database"
Some attributes in the Excel file don't exist in EMPACT. Check that all IP2M METRR attributes are loaded.

### "Cannot find level mapping"
The level number for an attribute doesn't exist. Verify levels 0-5 exist for all attributes.

### "The column 'type' does not exist"
Database schema mismatch. The ScoreSummary table structure differs from Prisma schema.

## Source Code Location

The import utility is located at:
```
web/scripts/import-ip2m-data-v2.ts
```

## Future Improvements

1. **Score Calculation**: Calculate scores from responses rather than using Excel values
2. **User Mapping**: Option to map legacy users to real EMPACT users
3. **Multiple Assessments**: Support multiple assessments in one Excel file
4. **Validation Report**: Generate pre-import validation report
5. **Export Utility**: Create matching export functionality