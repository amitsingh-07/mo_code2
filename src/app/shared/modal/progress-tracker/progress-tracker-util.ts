export class ProgressTrackerUtil {
    private static pathPattern = /\../;

    /**
     * Trim the '../' prefix and '/' suffix from the path
     *
     * @static
     * @param {*} path
     * @returns {string}
     * @memberof ProgressTrackerUtil
     */
    static trimPath(path): string {
        return path.replace(this.pathPattern, '').replace(/\/$/, '');
    }

    static compare(path1: string, path2: string): any {
        return this.trimPath(path1) === this.trimPath(path2);
    }
}
