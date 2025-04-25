#Get-Module -Name Microsoft.Entra -ListAvailable
#Install-Module -Name Microsoft.Entra -Repository PSGallery -Scope CurrentUser -Force -AllowClobber
#Connect-Entra -Scopes 'Directory.AccessAsUser.All'

$groupid = "9a01c262-c222-4bc9-b729-e29dd3722a72" #ObjectID of the group

$users = Get-MgGroupMember -GroupId $groupId

foreach ($user in $users) {
    $user = get-mguser -UserId $user.id
    $userupn = $user.userPrincipalName
    write-host $userupn

    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#-?".ToCharArray()
    $num  = "123456789".ToCharArray()
    $getnum = $num | Get-Random -Count 2
    $randomString = -join $getnum
     for ($i = 0; $i -lt 24; $i++) {
     $randomChar = $chars | Get-Random
     $randomString += $randomChar
     }
    #Write-Host $randomString #Uncomment if you want to see the password


    # Create the password profile with the generated password
    $passwordprofile = @{
        Password = $randomString
        forceChangePasswordNextSignIn = $False
        forceChangePasswordNextSignInWithMfa = $False
    }

    # Set the user's password using MgUser
    Update-MgUser -UserId $userupn -PasswordProfile $passwordprofile
}
