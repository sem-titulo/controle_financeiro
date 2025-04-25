export function cepMask(value: string) {
    console.log(value);
    return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
}
