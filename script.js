
        function calculateSubnet() {
            const ipAddress = document.getElementById("ipAddress").value;
            const subnetMask = document.getElementById("subnetMask").value;

            if (!validateIP(ipAddress)) {
                alert("Please enter a valid IP address.");
                return;
            }

            const ipParts = ipAddress.split('.').map(part => parseInt(part));
            const maskParts = subnetMask.split('.').map(part => parseInt(part));

            const networkAddressParts = ipParts.map((part, index) => part & maskParts[index]);
            const broadcastAddressParts = ipParts.map((part, index) => part | (~maskParts[index] & 255));

            const networkAddress = networkAddressParts.join('.');
            const broadcastAddress = broadcastAddressParts.join('.');

            const cidr = subnetMaskToCIDR(subnetMask);
            const totalHosts = Math.pow(2, 32 - cidr);
            const usableHosts = totalHosts - 2;
            const usableIPRange = `${networkAddressParts.slice(0, 3).join('.')}.1 - ${broadcastAddressParts.slice(0, 3).join('.')}.254`;

            document.getElementById("cidr").textContent = `CIDR Notation: /${cidr}`;
            document.getElementById("networkAddress").textContent = `Network Address: ${networkAddress}`;
            document.getElementById("broadcastAddress").textContent = `Broadcast Address: ${broadcastAddress}`;
            document.getElementById("usableIPRange").textContent = `Usable IP Range: ${usableIPRange}`;
            document.getElementById("totalHosts").textContent = `Total Hosts: ${totalHosts}`;
            document.getElementById("usableHosts").textContent = `Usable Hosts: ${usableHosts}`;

            // Calculate additional features
            const subnetMaskBinary = subnetMaskToBinary(subnetMask);
            const ipClass = calculateIPClass(ipParts[0]);
            const wildcardMask = calculateWildcardMask(subnetMask);
            const ipType = calculateIPType(ipParts);

            document.getElementById("subnetMaskBinary").textContent = `Binary Subnet Mask: ${subnetMaskBinary}`;
            document.getElementById("ipClass").textContent = `IP Class: ${ipClass}`;
            document.getElementById("wildcardMask").textContent = `Wildcard Mask: ${wildcardMask}`;
            document.getElementById("ipType").textContent = `IP Type: ${ipType}`;
        }

        function validateIP(ip) {
            const parts = ip.split('.');
            return parts.length === 4 && parts.every(part => !isNaN(part) && part >= 0 && part <= 255);
        }

        function subnetMaskToCIDR(mask) {
            return mask.split('.').reduce((cidr, octet) => cidr + (parseInt(octet).toString(2).match(/1/g) || []).length, 0);
        }

        function subnetMaskToBinary(mask) {
            return mask.split('.').map(part => parseInt(part).toString(2).padStart(8, '0')).join('.');
        }

        function calculateIPClass(firstOctet) {
            if (firstOctet >= 1 && firstOctet <= 126) {
                return 'A';
            } else if (firstOctet >= 128 && firstOctet <= 191) {
                return 'B';
            } else if (firstOctet >= 192 && firstOctet <= 223) {
                return 'C';
            } else if (firstOctet >= 224 && firstOctet <= 239) {
                return 'D';
            } else {
                return 'E';
            }
        }

        function calculateWildcardMask(subnetMask) {
            const maskParts = subnetMask.split('.').map(part => parseInt(part));
            const wildcardParts = maskParts.map(part => 255 - part);
            return wildcardParts.join('.');
        }

        function calculateIPType(ipParts) {
            const privateRanges = [
                ['10.0.0.0', '10.255.255.255'],
                ['172.16.0.0', '172.31.255.255'],
                ['192.168.0.0', '192.168.255.255']
            ];

            const ip = ipParts.join('.');
            for (const [start, end] of privateRanges) {
                const startIP = start.split('.').map(part => parseInt(part));
                const endIP = end.split('.').map(part => parseInt(part));
                const inRange = ipParts.every((part, index) => part >= startIP[index] && part <= endIP[index]);
                if (inRange) {
                    return 'Private';
                }
            }
            return 'Public';
        }
   
 
   
  