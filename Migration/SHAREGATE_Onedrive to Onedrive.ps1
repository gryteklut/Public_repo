
#CSV file has two colums: SourceSite,DestinationSite
#https://migration-tool.sharegate.com/hc/en-us/articles/115000473134-Walkthrough-Migrate-OneDrive-for-Business-to-OneDrive-for-Business-in-PowerShell 
#https://migration-tool.sharegate.com/hc/en-us/articles/115000731047

Import-Module Sharegate 

#Add two colums, SourceSite and DestinationSite (OneDrive URL)
$csvFile = "C:\Folder\File.csv"
$table = Import-Csv $csvFile -Delimiter “,” 

$srcsiteConnection = Connect-Site -Url $table[0].SourceSite -Browser
$dstsiteConnection = Connect-Site -Url $table[0].DestinationSite -Browser

Set-Variable srcSite, dstSite, srcList, dstList
foreach ($row in $table) {
    Clear-Variable srcSite
    Clear-Variable dstSite
    Clear-Variable srcList
    Clear-Variable dstList

    $srcSite = Connect-Site -Url $row.SourceSite -UseCredentialsFrom $srcsiteConnection
    $dstSite = Connect-Site -Url $row.DestinationSite -UseCredentialsFrom $dstsiteConnection
    $srcList = Get-List -Site $srcSite -Name "Documents"
    $dstList = Get-List -Site $dstSite -Name "Documents"

    Write-host "Moving $row.DestinationSite"
    
    #Copy settings allows for Incremental update, otherwise it copies entire OneDrive
    $copysettings = New-CopySettings -OnContentItemExists IncrementalUpdate 
    
    Copy-Content -SourceList $srcList -DestinationList $dstList -CopySettings $copysettings
    
    #Uncomment theese on last migration
    #Remove-SiteCollectionAdministrator -Site $srcSite
    #Remove-SiteCollectionAdministrator -Site $dstSite
}
