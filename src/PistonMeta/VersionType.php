<?php

namespace PistonMeta;

enum VersionType: string
{
    case RELEASE = 'release';
    case SNAPSHOT = 'snapshot';
    case OLD_BETA = 'old_beta';
    case OLD_ALPHA = 'old_alpha';
}
