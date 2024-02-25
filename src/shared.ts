export async function execAndLog<T extends () => any>(label: string, func: T): Promise<ReturnType<T>> {
    try {
        console.log(`${label} strat`);
        const start = Date.now();
        const res = await func();
        console.log(`${label} end, DurationMS: ${Date.now() - start}`);
        return res;
    } catch (error) {
        console.log(`error in ${label}`, error);
        throw error;
    }
}

export function getFileName(sourceName: string) {
    return sourceName.replace(/[/\\?%*:|"<>]/g, '-')
}