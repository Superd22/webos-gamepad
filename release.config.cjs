module.exports = {
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@google/semantic-release-replace-plugin",
      {
        "replacements": [
          {
            "files": [
              "app/public/appinfo.json"
            ],
            "from": "\"version\": \"[^\"]*\"",
            "to": "\"version\": \"${nextRelease.version}\"",
            "results": [
              {
                "file": "app/public/appinfo.json",
                "hasChanged": true,
                "numMatches": 1,
                "numReplacements": 1
              }
            ],
            "countMatches": true
          },
          {
            "files": [
              "app/public/appinfo.json"
            ],
            "from": "\"version\": \"[^\"]*\"",
            "to": (matched) => {
              // webos doesn't support -[alpha|beta] -_-
              const version = matched.split(':')[1].replace(/(\-[^"]*)/, '')
              return `"version":${version}`
            },
            "results": [
              {
                "file": "app/public/appinfo.json",
                "hasChanged": true,
                "numMatches": 1,
                "numReplacements": 1
              }
            ],
            "countMatches": true
          }
        ]
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "app/public/appinfo.json",
          "package.json",
          "package-lock.json",
          "CHANGELOG.md"
        ],
        "message": "release(version): Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "npm run package"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [
          {
            "path": "dist/app/appinfo.json",
            "label": "WebOS App Manifest"
          },
          {
            "path": "dist/com.superd22.bluetoothhid_*.ipk",
            "label": "WebOS IPK"
          }
        ]
      }
    ]
  ],
  "branches": [
    "master",
    {
      "name": "beta",
      "prerelease": true
    },
    {
      "name": "alpha",
      "prerelease": true
    }
  ]
}