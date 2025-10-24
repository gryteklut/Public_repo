
#CSV file has two colums: SourceSite,DestinationSite
#https://migration-tool.sharegate.com/hc/en-us/articles/115000473134-Walkthrough-Migrate-OneDrive-for-Business-to-OneDrive-for-Business-in-PowerShell 
#https://migration-tool.sharegate.com/hc/en-us/articles/115000731047



#Vi gidder ikke å legge til site-coladm på alle onedrives. Kjører SPO for Sikri tenant
$SrcAdminSiteURL="https://tenant-admin.sharepoint.com/"
$SrcSiteCollAdmin="Serviceaccount@domain.com"
Connect-SPOService -Url $SrcAdminSiteURL
#Just do set-spouser on the first site in the csv to test and create the session
#Set-SPOUser -Site $table[0].src -LoginName $SrcSiteCollAdmin -IsSiteCollectionAdmin $True

Import-Module Sharegate 

#Add two colums, SourceSite and DestinationSite (OneDrive URL)

$csvFile = "C:\csvfile.csv"
$table = Import-Csv $csvFile -Delimiter “,” 

$srcsiteConnection = Connect-Site -Url $table[0].src -Browser -DisableSSO
$dstsiteConnection = Connect-Site -Url $table[0].dst -Browser -DisableSSO

Set-Variable srcSite, dstSite, srcList, dstList
foreach ($row in $table) {
    Clear-Variable srcSite
    Clear-Variable dstSite
    Clear-Variable srcList
    Clear-Variable dstList

    Set-SPOUser -Site $row.src -LoginName $SrcSiteCollAdmin -IsSiteCollectionAdmin $True

    $srcSite = Connect-Site -Url $row.src -UseCredentialsFrom $srcsiteConnection
    $dstSite = Connect-Site -Url $row.dst -UseCredentialsFrom $dstsiteConnection
    $srcList = Get-List -Site $srcSite -Name Documents
    $dstList = Get-List -Site $dstSite -Name Documents

    Write-host "Moving $row.dst"
    #IncrementalUpdate
    #Copy settings allows for Incremental update, otherwise it copies entire OneDrive
    $copysettings = New-CopySettings -OnContentItemExists Skip
    
    Copy-Content -SourceList $srcList -DestinationList $dstList -CopySettings $copysettings
    
    #Uncomment theese on last migration
    #Remove-SiteCollectionAdministrator -Site $srcSite
    #Remove-SiteCollectionAdministrator -Site $dstSite
}
