#https://documentation.sharegate.com/hc/en-us/articles/115000641328

$tenant = Connect-Site -Url "https://mytenant-admin.sharepoint.com" -Browser
$csvFile = "C:\CSVfile.csv"
$table = Import-Csv $csvFile -Delimiter ","
foreach ($row in $table) {
    Get-OneDriveUrl -Tenant $tenant -Email $row.Email -ProvisionIfRequired -DoNotWaitForProvisioning
}
