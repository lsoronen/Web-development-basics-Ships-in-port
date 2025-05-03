const API_BASE = 'https://meri.digitraffic.fi/api/port-call/v1';
const portSelect = document.getElementById('portSelect');
const shipGrid = document.getElementById('shipGrid');

document.addEventListener('DOMContentLoaded', () => {
    const savedPort = localStorage.getItem('selectedPort');
    if (savedPort) portSelect.value = savedPort;
    loadShips(portSelect.value);
});

portSelect.addEventListener('change', () => {
    const portCode = portSelect.value;
    localStorage.setItem('selectedPort', portCode);
    loadShips(portCode);
});

async function loadShips(portCode) {
    shipGrid.innerHTML = '<p>Loading...</p>';
    const now = new Date().toISOString();

    try {
        const response = await fetch(`${API_BASE}/port-calls?etdFrom=${now}&ataTo=${now}&locode=${portCode}`, {
            headers: {
                'Digitraffic-User': 'OAMKopiskelija/PortApp 1.0',
                'Accept': 'application/json;charset=UTF-8'
            }
        });

        const data = await response.json();
        const portCalls = data.portCalls || [];

        const shipsInPort = portCalls.filter(call => {
            const ata = new Date(call.portAreaDetails?.[0]?.ata || 0);
            const etd = new Date(call.portAreaDetails?.[0]?.etd || 0);
            const nowTime = new Date();
            return ata < nowTime && etd > nowTime;
        });

        if (shipsInPort.length === 0) {
            shipGrid.innerHTML = '<div class="ship-card no-ships">No ships currently in port.</div>';
            return;
        }

        shipGrid.innerHTML = '';
        for (const ship of shipsInPort) {
            const mmsi = ship.mmsi;
            const vesselDetails = await getVesselDetails(mmsi);
            const type = vesselDetails?.vesselConstruction?.vesselTypeName || 'Unknown';
            let len = vesselDetails?.vesselDimensions?.length || 'N/A';
            const netTonnage = vesselDetails?.vesselDimensions?.netTonnage || 'N/A';
            const grossTonnage = vesselDetails?.vesselDimensions?.grossTonnage || 'N/A';
            const cargo = ship.arrivalWithCargo
            const loading = !ship.notLoading

            let hasCargo = 'Unknown'
            let willLoad = 'Unknown'

            if (cargo) {
                hasCargo = 'Yes'
            } else {
                hasCargo = 'No'
            }

            if (loading) {
                willLoad = 'Yes'
            } else {
                willLoad = 'No'
            }

            if (len !='N/A'){
                len = `${len} m`
            }

            const card = document.createElement('div');
            card.className = 'ship-card';
            card.innerHTML = `
                <h2>${ship?.vesselNamePrefix || ''} ${ship?.vesselName || 'Unknown'}</h2>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Lenght:</strong> ${len}</p>
                <p><strong>Net Tonnage:</strong> ${netTonnage}</p>
                <p><strong>Gross Tonnage:</strong> ${grossTonnage}</p>
                <p><strong>Nationality:</strong> ${ship?.nationality || 'Unknown'}</p>
                <p><strong>Crew:</strong> ${ship.imoInformation?.[0]?.numberOfCrew || 'N/A'}</p>
                <p><strong>Pier:</strong> ${ship.portAreaDetails?.[0]?.berthName || 'Unknown'}</p>
                <p><strong>With Cargo:</strong> ${hasCargo}</p>
                <p><strong>Will Load:</strong> ${willLoad}</p>
                `;
            shipGrid.appendChild(card);
        }

    } catch (error) {
        alert(error)
    }

}

async function getVesselDetails(mmsi) {
    if (!mmsi || mmsi === 0) return null;
    try {
        const res = await fetch(`${API_BASE}/vessel-details?mmsi=${mmsi}`);
        const details = await res.json();
        return details?.[0] || null;
    } catch (e) {
        console.error("Failed to get vessel details", e);
        return null;
    }
}