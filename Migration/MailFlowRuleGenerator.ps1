#This script add new Mail Flow Rule for forwarding email. Useful when migrating to new tenant with new domain.
#Connect-ExchangeOnline

#Create a csb with the colums, Source and Destionation
$addresses = Import-Csv C:\Folder\File.csv -Delimiter ","

Foreach ($address in $addresses) {
    $src = $address.Source
    $dest = $address.Destination

#Consider naming convention that is easy to identify incase of cleanup
    New-TransportRule -Name "Forward $src to $dest" -SentTo $src -RedirectMessageTo $dest
}
