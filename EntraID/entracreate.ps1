# Check if Microsoft.Graph.Authentication module is installed and import it
# HOTFIX
# Install-Module -Name Microsoft.Graph -Force -AllowClobber

# Function to write log messages

try {
    # Connect to Microsoft Graph
    # HOTFIX
    #Install-Module -Name Microsoft.Graph -Force -AllowClobber -scope CurrentUser
    Connect-MgGraph -Scopes "User.Read.All, GroupMember.ReadWrite.All, User.ReadWrite.All" -NoWelcome
    Write-Host "Connected to Microsoft Graph"

    # Specify the path of the CSV file
    $CSVFilePath = "C:\folder\users\users.csv"

    # Import data from CSV file
    $csv_users = Import-Csv -Path $CSVFilePath -Encoding UTF8

    foreach ($csv_user in $csv_users) {
        
        $user = $null

        try {
            $user = Get-MgUser -UserId $csv_user.userPrincipalName -Property DisplayName,GivenName,Surname,MailNickName,UserPrincipalName,Mail,OtherMails,JobTitle,CompanyName,Department,City,streetaddress,mobilePhone,Country,OfficeLocation,UsageLocation,AccountEnabled -ErrorAction SilentlyContinue
        }
        catch {
            Write-Host ("Failed to get {0}" -f $csv_user.userPrincipalName) -Level "ERROR"
        }

        if ($user) {
            try {
                #Check all field for changes, compares csv and get-mguser. Script will output changes made
                $updateParams = @{}
                $fieldsToCheck = @{
                    # To enable all users, uncomment the next line:
                    AccountEnabled = $true
                    DisplayName          = [string]$csv_user.displayName
                    GivenName            = [string]$csv_user.GivenName
                    Surname              = [string]$csv_user.surname
                    MailNickName         = [string]$csv_user.MailNickName
                    UserPrincipalName    = [string]$csv_user.userPrincipalName
                    Mail                 = [string]$csv_user.userPrincipalName
                    OtherMails           = [string]$csv_user.mail
                    JobTitle             = [string]$csv_user.JobTitle
                    CompanyName          = [string]$csv_user.companyName
                    Department           = [string]$csv_user.department
                    City                 = [string]$csv_user.city
                    streetaddress        = [string]$csv_user.streetaddress
                    mobilePhone          = [string]$csv_user.mobilePhone
                    Country              = [string]$csv_user.country
                    OfficeLocation       = [string]$csv_user.officeLocation
                    UsageLocation        = [string]$csv_user.usageLocation
                }
                #perform comparison and add to updateParams if different
                foreach ($key in $fieldsToCheck.Keys) {
                    $newValue = $fieldsToCheck[$key]
                    $oldValue = $user.$key
                    if (-not [string]::IsNullOrEmpty($newValue) -and $newValue -ne $oldValue) {
                        $updateParams[$key] = $newValue
                        Write-Host ("Field '{0}' changed: old='{1}' new='{2}'" -f $key, $oldValue, $newValue)
                    }
                }
                # if any changes detected, perform update
                if ($updateParams.Count -gt 0) {
                    Update-MgUser -UserId $csv_user.userPrincipalName -BodyParameter $updateParams
                    Write-Host ("Updated {0} " -f $csv_user.userPrincipalName)
                } else {
                    Write-Host ("No changes on {0} " -f $csv_user.userPrincipalName)
                }
            }
            catch {
                Write-Host ("Failed to update {0} {1}" -f ($csv_user.userPrincipalName, $_)) -Level "ERROR"
                exit 1
            }
        } else {

            #Create a new password
            Add-Type -AssemblyName 'System.Web'
            $randomString = [System.Web.Security.Membership]::GeneratePassword(32, 3)

            $password_profile = @{
                Password = $randomString
                ForceChangePasswordNextSignIn = $false
                forceChangePasswordNextSignInWithMfa = $False
            }    

            try {       
                # First create the user with required attributes
                $user = New-MgUser -DisplayName $csv_user.displayName `
                -PasswordProfile $password_profile `
                -AccountEnabled:$false `
                -MailNickName $csv_user.MailNickName `
                -UserPrincipalName  $csv_user.userPrincipalName `
                -Mail $csv_user.userPrincipalName `

             

                Write-Host ("Created {0} " -f $csv_user.userPrincipalName)

                # After creation, wait for the directory to provision and retrieve the created user's Id
                $createdUser = $null
                $maxAttempts = 6
                $attempt = 0
                while (-not $createdUser -and $attempt -lt $maxAttempts) {
                    Start-Sleep -Seconds (2 * ($attempt + 1))
                    try {
                        $createdUser = Get-MgUser -UserId $csv_user.userPrincipalName -ErrorAction SilentlyContinue
                    }
                    catch {
                        # ignore and retry
                    }
                    $attempt++
                }

                if (-not $createdUser) {
                    Write-Host ("Warning: created user {0} could not be found after creation; skipping optional updates." -f $csv_user.userPrincipalName)
                }
                # Updating optional attributes if they are not null or empty, empty attributes cause errors. pretty sure a loop could do this lol
                $updateParams = @{}

                if (-not [string]::IsNullOrEmpty($csv_user.JobTitle)) {
                    $updateParams.Add('JobTitle', $csv_user.JobTitle)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.companyName)) {
                    $updateParams.Add('companyName', $csv_user.companyName)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.department)) {
                    $updateParams.Add('department', $csv_user.department)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.mail)) {
                    $updateParams.Add('OtherMails', $csv_user.mail)
                }
                
                if (-not [string]::IsNullOrEmpty($csv_user.surname)) {
                    $updateParams.Add('surname', $csv_user.surname)
                }
                
                if (-not [string]::IsNullOrEmpty($csv_user.GivenName)) {
                    $updateParams.Add('GivenName', $csv_user.GivenName)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.streetaddress)) {
                    $updateParams.Add('streetaddress', $csv_user.streetaddress)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.mobilePhone)) {
                    $updateParams.Add('mobilePhone', $csv_user.mobilePhone)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.officeLocation)) {
                    $updateParams.Add('OfficeLocation', $csv_user.officeLocation)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.usageLocation)) {
                    $updateParams.Add('UsageLocation', $csv_user.usageLocation)
                }

                if (-not [string]::IsNullOrEmpty($csv_user.country)) {
                    $updateParams.Add('Country', $csv_user.country)
                }

                if ($updateParams.Count -gt 0) {
                    try {
                        Update-MgUser -UserId $csv_user.userPrincipalName -BodyParameter $updateParams -ErrorAction SilentlyContinue
                    }
                    catch {
                        Write-Host ("Warning: Failed to update optional attributes for {0}: {1}" -f $csv_user.userPrincipalName, $_)
                        # Don't exit here since the user was created successfully
                    }
                }
            }
        
            catch {
                Write-Host ("Failed to create {0} {1}" -f ($csv_user.userPrincipalName, $_)) -Level "ERROR"
                exit 1
            }
        }
    }

}
finally {
    Write-Host "Script completed"
    #Comment when not Mac, on windows is it wackywackywack
   # $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    #Add-Content -Path $logFile -Value "--- Script execution ended at $timestamp ---`n"
}
