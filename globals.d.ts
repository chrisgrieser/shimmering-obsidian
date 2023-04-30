// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking
// https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
//──────────────────────────────────────────────────────────────────────────────

declare const ObjC: {
	import: (package: "stdlib" | "Foundation") => void;
	unwrap: (string: string) => string;
};

declare const Application: {
	currentApplication: () => any;
	(appname: string): any;
};

declare function Path(filepath: string): string;

declare function delay(seconds: number): void;

declare const $: {
	getenv: (envVar: string) => string;
	NSFileManager: any;
	NSUTF8StringEncoding: any;
	NSProcessInfo: any;
	NSURL: any;
	NSString: any;
	NSData: any;
};
