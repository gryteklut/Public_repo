#Get-Module -Name Microsoft.Entra -ListAvailable
#Install-Module -Name Microsoft.Entra -Repository PSGallery -Scope CurrentUser -Force -AllowClobber
#Connect-Entra -Scopes 'Directory.AccessAsUser.All'

#Import CSV file, use group exports
$csvfile = "C:\migration\Retail_2025-4-25.csv"
$users = Import-Csv $csvfile -Delimiter ","

foreach ($user in $users) {
    $userupn = $user.userPrincipalName
    write-host $userupn

    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#-?".ToCharArray()
    $randomString = ""
     for ($i = 0; $i -lt 24; $i++) {
     $randomChar = $chars | Get-Random
     $randomString += $randomChar
     }
    Write-Host $randomString


    # Create the password profile with the generated password
    $passwordprofile = @{
        Password = $randomString
        forceChangePasswordNextSignIn = $False
        forceChangePasswordNextSignInWithMfa = $False
    }

    # Set the user's password using MgUser
    Update-MgUser -UserId $userupn -PasswordProfile $passwordprofile
}
