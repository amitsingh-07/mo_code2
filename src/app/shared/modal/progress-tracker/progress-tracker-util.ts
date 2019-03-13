export class ProgressTrackerUtil {
    private static pathPattern = /../;

    static trimPath(path): string {
        return path.replace(this.pathPattern, '');
    }

    static compare(path1: string, path2: string): any {
        return this.trimPath(path1) === this.trimPath(path2);
    }
}
