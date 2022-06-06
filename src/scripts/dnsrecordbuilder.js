/**
 * 
 * @param {*} DNSRecordInfo
 * @param {String} DNSRecordInfo.type
 * @param {String} DNSRecordInfo.domain
 * @param {Number} DNSRecordInfo.ttl - The length of time a resolver should keep this record cached, in seconds.
 * @param {String} DNSRecordInfo.value
 */
function buildDNSRecord({
    type = 'CNAME',
    domain = '',
    ttl = 3600,
    value = ''
}) {
    // type checking
    if (typeof type !== 'string') {
        throw Error(`"type" is not a String.`)
    }
    if (typeof domain !== 'string') {
        throw Error(`"domain" is not a String.`)
    }
    if (typeof ttl !== 'number' || isNaN(ttl)) {
        throw Error(`"ttl" is not a Number.`)
    }
    if (typeof value !== 'string') {
        throw Error(`"value" is not a String.`)
    }

    return `${type.toUpperCase()} ${domain} ${ttl} ${value}`
}