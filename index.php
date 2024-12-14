<?php

use PistonMeta\VersionManifest;

require 'vendor/autoload.php';

$versionId = substr($_SERVER['REQUEST_URI'], 1);
if ($versionId) {
    $title = "How old is Minecraft " . $versionId . " today?";
} else {
    $versionId = '1.0';
    $title = "How old is Minecraft today?";
}

$versionManifest = VersionManifest::fetch();
$version = $versionManifest->getVersion($versionId);

$locale = Locale::acceptFromHttp($_SERVER['HTTP_ACCEPT_LANGUAGE']);
if (!$locale) {
    $locale = 'en';
}
$dateFormatter = new IntlDateFormatter($locale, IntlDateFormatter::LONG, IntlDateFormatter::LONG);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title><?= $title ?></title>
    <link rel="icon" href="/favicon.svg">
    <link rel="stylesheet" href="/index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="View the age of any Minecraft version">
</head>
<body>
<?php if ($version): ?>
    <div class=center>
        <div class="center-text" id="age">
            <h1>Minecraft <?= $version->id ?> is <?= $version->getFormattedAge() ?> old.</h1>
            <h2>It was released on <?= $dateFormatter->format($version->releaseTime) ?></h2>
        </div>
    </div>
    <div id="footer">
        <div class="center-text">
            <p id="links">
                <?php foreach ($versionManifest->getPromotedVersions() as $v): ?>
                    <a href="/<?= $v->id ?>"><?= $v->id ?></a>
                <?php endforeach; ?>
            </p>
            <p>Made by <a href="https://vennen.me">Julian Vennen</a></p>
        </div>
    </div>
<?php else: ?>
    <div class="center">
        <div class="center-text">
            <h1>Version not found</h1>
            <p>Try one of these:</p>
            <p id="links">
                <?php foreach ($versionManifest->getPromotedVersions() as $v): ?>
                    <a href="/<?= $v->id ?>"><?= $v->id ?></a>
                <?php endforeach; ?>
            </p>
        </div>
    </div>
<?php endif; ?>
</body>
</html>
