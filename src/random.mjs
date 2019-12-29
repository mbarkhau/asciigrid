export function shuffler(seed) {
    seed = typeof seed == 'undefined' ? 0x2F6E2B1 : seed;

    // https://gist.github.com/mathiasbynens/5670917
    function random() {
        // Robert Jenkins’ 32 bit integer hash function
        seed = ((seed + 0x7ED55D16) + (seed << 12))  & 0xFFFFFFFF;
        seed = ((seed ^ 0xC761C23C) ^ (seed >>> 19)) & 0xFFFFFFFF;
        seed = ((seed + 0x165667B1) + (seed << 5))   & 0xFFFFFFFF;
        seed = ((seed + 0xD3A2646C) ^ (seed << 9))   & 0xFFFFFFFF;
        seed = ((seed + 0xFD7046C5) + (seed << 3))   & 0xFFFFFFFF;
        seed = ((seed ^ 0xB55A4F09) ^ (seed >>> 16)) & 0xFFFFFFFF;
        return (seed & 0xFFFFFFF) / 0x10000000;
    };

    // https://stackoverflow.com/a/6274381/62997
    return function (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    };
}
