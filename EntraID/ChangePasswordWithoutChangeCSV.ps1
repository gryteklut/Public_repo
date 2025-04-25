#Get-Module -Name Microsoft.Entra -ListAvailable
#Install-Module -Name Microsoft.Entra -Repository PSGallery -Scope CurrentUser -Force -AllowClobber
#Connect-Entra -Scopes 'Directory.AccessAsUser.All'

#Import CSV file, use group exports
$csvfile = "C:\migration\Retail_2025-4-25.csv"
$users = Import-Csv $csvfile -Delimiter ","

foreach ($user in $users) {
    $userupn = $user.userPrincipalName
    write-host $userupn

    #Create a new password
    Add-Type -AssemblyName 'System.Web'
    $NewPassword = [System.Web.Security.Membership]::GeneratePassword(24, 3)

    #Write-Host $NewPassword #Uncomment to view new password
    
    # Create the password profile with the generated password
    $passwordprofile = @{
        Password = $NewPassword
        forceChangePasswordNextSignIn = $False
        forceChangePasswordNextSignInWithMfa = $False
    }
    # Set the user's password using MgUser
    Update-MgUser -UserId $userupn -PasswordProfile $passwordprofile
}
