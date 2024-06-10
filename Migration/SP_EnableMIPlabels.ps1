# Returns the list of all settings templates
Get-AzureADDirectorySettingTemplate
# Use the Group.Unified template
$TemplateId = (Get-AzureADDirectorySettingTemplate | where { $_.DisplayName -eq "Group.Unified" }).Id
$Template = Get-AzureADDirectorySettingTemplate | where -Property Id -Value $TemplateId -EQ
# Create a new settings object based on that template
$Setting = $Template.CreateDirectorySetting()
# Update the settings object with a new value
$Setting["EnableMIPLabels"] = "True"
# Apply the setting
New-AzureADDirectorySetting -DirectorySetting $Setting
