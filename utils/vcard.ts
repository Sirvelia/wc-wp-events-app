import { ContactDetails } from '@/stores/contactStore';

/**
 * Generates a VCard 3.0 format string from contact details.
 * 
 * @param contactData - The contact details to convert to VCard format
 * @returns VCard 3.0 formatted string
 */
export function generateVCard(contactData: ContactDetails): string {
    const lines: string[] = [];
    
    // VCard header
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');

    console.log(contactData);
    
    // Full name (required)
    if (contactData.fullName) {
        lines.push(`FN:${escapeVCardValue(contactData.fullName)}`);
        lines.push(`N:${escapeVCardValue(contactData.fullName)};;;;`);
    }
    
    // Email (required)
    if (contactData.email) {
        lines.push(`EMAIL:${escapeVCardValue(contactData.email)}`);
    }
    
    // Phone number
    if (contactData.phone) {
        lines.push(`TEL:${escapeVCardValue(contactData.phone)}`);
    }
    
    // Company/Organization
    if (contactData.company) {
        lines.push(`ORG:${escapeVCardValue(contactData.company)}`);
    }
    
    // Personal website
    if (contactData.websiteUrl) {
        const websiteUrl = contactData.websiteUrl.startsWith('http')
            ? contactData.websiteUrl
            : `https://${contactData.websiteUrl}`;
        lines.push(`URL;TYPE=HOME:${escapeVCardValue(websiteUrl)}`);
    }
    
    // VCard footer
    lines.push('END:VCARD');

    console.log(lines.join('\r\n'));
    
    // Join with CRLF (VCard standard)
    return lines.join('\r\n');
}

/**
 * Escapes special characters in VCard values according to VCard 3.0 specification.
 * 
 * @param value - The value to escape
 * @returns Escaped value
 */
function escapeVCardValue(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}


