export function main() {
  console.log('zeed');
}

/* v8 ignore start */
if (process.env.NODE_ENV !== 'test') {
  main();
}
/* v8 ignore end */
