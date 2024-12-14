<?php

namespace PistonMeta;

use DateTimeImmutable;

readonly class Version
{
    public function __construct(
        public string            $id,
        public VersionType       $type,
        public DateTimeImmutable $releaseTime,
    )
    {
    }

    public function getAge(): \DateInterval
    {
        return $this->releaseTime->diff(new DateTimeImmutable());
    }

    public function getFormattedAge(): string
    {
        $age = $this->getAge();
        $formattedAge = '';
        if ($years = $age->y) {
            $formattedAge .= $years . ' year' . ($years > 1 ? 's' : '') . ' ';
        }
        if ($months = $age->m) {
            $formattedAge .= $months . ' month' . ($months > 1 ? 's' : '') . ' ';
        }
        if ($days = $age->d) {
            $formattedAge .= $days . ' day' . ($days > 1 ? 's' : '') . ' ';
        }

        if (!$age->y && !$age->m) {
            if ($hours = $age->h) {
                $formattedAge .= $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ';
            }

            if (!$age->d) {
                if ($minutes = $age->i) {
                    $formattedAge .= $minutes . ' minute' . ($minutes > 1 ? 's' : '') . ' ';
                }
                if ($seconds = $age->s) {
                    $formattedAge .= $seconds . ' second' . ($seconds > 1 ? 's' : '') . ' ';
                }
            }

        }

        return $formattedAge;
    }

    public function withoutPatch(): string
    {
        $parts = explode(".", $this->id);

        if (count($parts) === 1) {
            return $parts[0];
        }

        return $parts[0] . '.' . $parts[1];
    }
}
