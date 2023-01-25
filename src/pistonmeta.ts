interface RawPistonMetaVersion {
    id: string,
    type: "snapshot"|"release"|"old_beta"|"old_alpha",
    url: string,
    time: string,
    releaseTime: string,
}

export class PistonMetaVersion {
    id: string;
    type: "snapshot"|"release"|"old_beta"|"old_alpha";
    url: string;
    time: Date;
    releaseTime: Date;

    constructor(data: RawPistonMetaVersion) {
        this.id = data.id;
        this.type = data.type;
        this.url = data.url;
        this.time = new Date(data.time);
        this.releaseTime = new Date(data.releaseTime);
    }

    get relativeReleaseTime(): number {
        return Math.ceil((new Date().getTime() - this.releaseTime.getTime()) / 1000);
    }
}

interface RawPistonMetaVersionManifest {
    latest: {
        release: string,
        snapshot: string,
    },
    versions: RawPistonMetaVersion[]
}

export class PistonMetaVersionManifest {
    latest: {
        release: string,
        snapshot: string,
    };
    versions: PistonMetaVersion[];

    static async fetch(): Promise<PistonMetaVersionManifest> {
        const content = await fetch(new URL("https://piston-meta.mojang.com/mc/game/version_manifest.json"));
        const json: RawPistonMetaVersionManifest = await content.json();
        return new PistonMetaVersionManifest(json);
    }

    constructor(data: RawPistonMetaVersionManifest) {
        this.latest = data.latest;
        this.versions = data.versions.map(data => new PistonMetaVersion(data));
    }

    getVersion(id: string): PistonMetaVersion|null {
        return this.versions.find(version => version.id === id) ?? null;
    }

    getPromotedVersions(): PistonMetaVersion[] {
        const versions = [];

        const snapshot = this.getVersion(this.latest.snapshot);
        if (snapshot?.type === "snapshot") {
            versions.push(snapshot);
        }

        versions.push(...this.versions.filter(v => v.type === "release").slice(0, 10));

        const release = this.getVersion("1.0");
        if (release) {
            versions.push(release);
        }

        return versions;
    }
}
