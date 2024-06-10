#used to add domain to teams external allowed list, import-module microsoftteams and connect-microsofteams
#Check if domain is already in list, if not add. Support list a domains.

#Allowed domains, get the variables from a form or list
$allowdomains = "domain1.com", "domain2.com", "domain3.com"
$Getfederation = Get-CsTenantFederationConfiguration | Select-Object -ExpandProperty AllowedDomains
$results = @()
foreach ($domain in $allowdomains) {
    #Add domain in list, to a cleaned list til verify if contain
    $existingDomains = $Getfederation.AllowedDomain -join ',' -replace "Domain=", ""
    if ($existingDomains.contains($domain)) {
        $results += "$domain already allowed"
    }
    else {
        #append domain not already in list to list
        Set-CsTenantFederationConfiguration -AllowedDomainsAsAList @{Add = $domain }
        $results += "$domain is added to external domains"
    }
}
Write-Output $results
