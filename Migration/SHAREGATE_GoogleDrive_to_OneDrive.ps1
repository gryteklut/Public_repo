Import-Module Sharegate

#Set Runtime Parameters
$AdminSiteURL="https://COMPANY-admin.sharepoint.com/"
$SiteCollAdmin="YOURADMIN@domain.com"
 
#Connect to SharePoint Online Admin Center
Connect-SPOService -Url $AdminSiteURL
# Define the CSV file path
$csvFile = "C:\migfiles\batch1.csv"
# Import the CSV file
$table = Import-Csv $csvFile -Delimiter ","
# Connect to Google Drive as an admin
$connection = Connect-GoogleDrive -Email admin@domain.com -Admin
# Define credentials for OneDrive
$session = Connect-Site -Url $table[0].ONEDRIVEURL -Browser
# Set variables for site and list operations
Set-Variable dstSite, dstList

# Loop through each row in the CSV
foreach ($row in $table) {
    Write-host "New site " + $row
    # Clear previous values of variables
    Clear-Variable dstSite
    Clear-Variable dstList

    Write-host "Add Site Collection Admin to the OneDrive"
    $OneDriveSiteUrl= $row.ONEDRIVEURL
    Set-SPOUser -Site $OneDriveSiteUrl -LoginName $SiteCollAdmin -IsSiteCollectionAdmin $True
    # Connect to the user's OneDrive site
    $dstSite = Connect-Site -Url $row.ONEDRIVEURL -UseCredentialsFrom $session

    # Get the "Documents" list from the OneDrive site
    $dstList = Get-List -Site $dstSite -Name Dokumenter 
    # Get the Google Drive for the specified user
    $myDrive = Get-GoogleMyDrive -Connection $connection -Email $row.GOOGLEDRIVEEMAIL
    #Copy settings allows for skipping existing, otherwise it copies entire OneDrive. On cut-over change to incremental 
    $copysettings = New-CopySettings -OnContentItemExists Skip 
    # Import documents from Google Drive to the OneDrive "Documents" list
    Write-host "Starting migration of " + $row.GOOGLEDRIVEEMAIL " to" + $row.ONEDRIVEURL
    Import-GoogleDriveDocument -Drive $myDrive -SourceView "MyDocuments" -DestinationList $dstList -CopySettings $copysettings
    # Remove site collection administrator permissions, uncomment on cutover
    #Remove-SiteCollectionAdministrator -Site $dstSite
}
