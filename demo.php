<?php
require_once(__DIR__ . '/vendor/autoload.php');
require_once(__DIR__ . '/VxPhpSdk/TinypassClient.php');

$userEmailsCsv = fopen(__DIR__ . '/sample-files/userEmails.csv', 'r');
$userNamesCsv = fopen(__DIR__ . '/sample-files/userNames.csv', 'r');

$usersByUserId = [];
$userIdsByEmail = [];

$userEmailHeaders = fgetcsv($userEmailsCsv);
while($userEmailRow = fgetcsv($userEmailsCsv)) {
    $userEmailInformation = array_combine($userEmailHeaders, $userEmailRow);
    $usersByUserId[$userEmailInformation['user_id']] = $userEmailInformation;
    $userIdsByEmail[$userEmailInformation['email']] = $userEmailInformation['user_id'];
}
fclose($userEmailsCsv);

$userNameHeaders = fgetcsv($userNamesCsv);
while($userNameRow = fgetcsv($userNamesCsv)) {
    $userNameInformation = array_combine($userNameHeaders, $userNameRow);

    $userId = $userNameInformation['user_id'];

    if(!isset($usersByUserId[$userId])) {
        throw new \Exception("Missing user ID $userId");
    }

    unset($userNameInformation['user_id']);
    $usersByUserId[$userId] = array_merge($usersByUserId[$userId], $userNameInformation);
}
fclose($userNamesCsv);

// SDK obviously makes this much easier than the JS one

(new \Symfony\Component\Dotenv\Dotenv())->load(__DIR__ . '/.env'); // loads .env into $_ENV

$tpConfig = new TPConfig(
    $_ENV['PIANO_API_AID'], $_ENV['PIANO_API_TOKEN'], null, true
);

$tinypassClient = new TinypassClient($tpConfig);

$publisherUserApiResponse = $tinypassClient->callAPI(
    '/publisher/user/list', 'POST', ['aid' => $tpConfig->AID], []
);

foreach($publisherUserApiResponse->users as $user) {
    [
        'uid' => $userId,
        'email' => $email,
    ] = get_object_vars($user);

    $incorrectUserId = $userIdsByEmail[$email] ?? null;
    if($incorrectUserId) {
        echo "Replacing User ID $incorrectUserId with $userId\n";
        $currentUserInformation = $usersByUserId[$incorrectUserId];
        $usersByUserId[$incorrectUserId]['user_id'] = $userId ?? $currentUserInformation['user_id'];
    }
}

$mergedCsvFile = fopen(__DIR__ . '/sample-files/mergedPhp.csv', 'w');
$headers = ['user_id', 'email', 'first_name', 'last_name'];

fputcsv($mergedCsvFile, $headers);

foreach($usersByUserId as $userInformation) {
    fputcsv(
        $mergedCsvFile,
        array_map(function($header) use ($userInformation) { return $userInformation[$header]; }, $headers),
    );
}

fclose($mergedCsvFile);

echo 'Merge complete!';