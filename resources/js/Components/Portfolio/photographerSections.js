// Missing flags stay visible so the page remains intact while a deployment is
// between shipping the frontend and running the database migration.
export function isPhotoSectionEnabled(settings, key) {
    return settings[key] !== '0';
}
