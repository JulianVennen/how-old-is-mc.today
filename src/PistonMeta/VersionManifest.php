<?php

namespace PistonMeta;

use Aternos\CurlPsr\Psr18\Client;
use Aternos\CurlPsr\Psr7\Message\Request;
use Aternos\CurlPsr\Psr7\Uri;
use DateTimeImmutable;

readonly class VersionManifest
{
    public static function fetch(): static
    {
        $client = new Client();
        $response = $client->sendRequest(new Request(
            'GET',
            new Uri(
                'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
            )
        ));
        $data = json_decode($response->getBody()->getContents(), true);

        /**
         * @var array<string, Version> $versionMap
         */
        $versionMap = [];
        foreach ($data['versions'] as $v) {
            $version = new Version(
                $v['id'],
                VersionType::from($v['type']),
                DateTimeImmutable::createFromFormat(DATE_ATOM, $v['releaseTime'])
            );
            $versionMap[$version->id] = $version;
        }
        return new static($versionMap);
    }

    private function __construct(
        /**
         * @var array<string, Version> $versionMap
         */
        public array $versionMap,
    )
    {
    }

    public function getVersion(string $id): ?Version
    {
        return $this->versionMap[$id] ?? null;
    }

    /**
     * @return Version[]
     */
    public function getPromotedVersions(): array
    {
        $versions = [];
        /** @var $previousVersion Version|null */
        $previousVersion = null;
        foreach ($this->versionMap as $version) {
            if ($version->type !== VersionType::RELEASE) {
                continue;
            }

            if ($version->withoutPatch() !== $previousVersion?->withoutPatch()) {
                $versions[] = $version;
                $previousVersion = $version;
            }
        }
        return $versions;
    }
}
