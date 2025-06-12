document.addEventListener("DOMContentLoaded", function () {
    // Dark mode toggle
    let toggle = document.createElement("div");
    toggle.classList.add("dark-mode-toggle");
    toggle.innerText = "☀︎";
    document.body.appendChild(toggle);

    // Hide/show list toggle
    let listToggle = document.createElement("div");
    listToggle.classList.add("hide-list-toggle");
    listToggle.innerText = "☰";
    listToggle.title = "Hide/show character list";
    document.body.appendChild(listToggle);

    // Check local storage for mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 1em; height: 1em; vertical-align: top; fill: currentColor; overflow: hidden;" viewBox="0 0 1024 1024" version="1.1"><path d="M529.611373 1023.38565c-146.112965 0-270.826063-51.707812-374.344078-155.225827C51.74928 764.641808 0.041469 639.826318 0.041469 493.815745c0-105.053891 29.693595-202.326012 88.978393-292.22593 59.38719-89.797526 137.000103-155.942569 232.83874-198.63991 6.041111-4.607627 12.184613-3.788493 18.225724 2.252618 7.576986 4.607627 9.931996 11.365479 6.860244 20.580733C322.677735 83.736961 310.493122 142.202626 310.493122 201.589815c0 135.464227 48.328885 251.474031 144.986656 348.131801 96.657771 96.657771 212.667574 144.986656 348.131801 144.986656 74.541162 0 139.252721-11.365479 194.032283-34.19883C1003.684974 655.799424 1009.726084 656.618558 1015.767195 662.659669c7.576986 4.607627 9.931996 11.365479 6.860244 20.580733C983.104241 786.758417 918.802249 869.286132 829.721465 930.925939 740.743072 992.565746 640.706375 1023.38565 529.611373 1023.38565z"/></svg>`;
    }

    // Check local storage for list visibility preference
    if (localStorage.getItem("listVisible") === "false") {
        document.querySelector('.character-list').style.display = "none";
        listToggle.innerText = "☰";
    }

    toggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 1em; height: 1em; vertical-align: top; fill: currentColor; overflow: hidden;" viewBox="0 0 1024 1024" version="1.1"><path d="M529.611373 1023.38565c-146.112965 0-270.826063-51.707812-374.344078-155.225827C51.74928 764.641808 0.041469 639.826318 0.041469 493.815745c0-105.053891 29.693595-202.326012 88.978393-292.22593 59.38719-89.797526 137.000103-155.942569 232.83874-198.63991 6.041111-4.607627 12.184613-3.788493 18.225724 2.252618 7.576986 4.607627 9.931996 11.365479 6.860244 20.580733C322.677735 83.736961 310.493122 142.202626 310.493122 201.589815c0 135.464227 48.328885 251.474031 144.986656 348.131801 96.657771 96.657771 212.667574 144.986656 348.131801 144.986656 74.541162 0 139.252721-11.365479 194.032283-34.19883C1003.684974 655.799424 1009.726084 656.618558 1015.767195 662.659669c7.576986 4.607627 9.931996 11.365479 6.860244 20.580733C983.104241 786.758417 918.802249 869.286132 829.721465 930.925939 740.743072 992.565746 640.706375 1023.38565 529.611373 1023.38565z"/></svg>`;
        } else {
            localStorage.removeItem("darkMode");
            toggle.innerText = "☀︎";
        }
    });

    listToggle.addEventListener("click", function () {
        const characterList = document.querySelector('.character-list');
        const isVisible = characterList.style.display !== "none";
        
        if (isVisible) {
            characterList.style.display = "none";
            localStorage.setItem("listVisible", "false");
            listToggle.innerText = "☰";
        } else {
            characterList.style.display = "block";
            localStorage.setItem("listVisible", "true");
            listToggle.innerText = "☰";
        }
    });
});


// Initialize all global variables first
const width = window.innerWidth;
const height = window.innerHeight;
let nodes = [];
let links = [];
let node, link, labelGroups;
let simulation;
let validNodeNames = new Set();
let drag; // Declare drag variable
let selectedNode = null; // Track currently selected node
let characterDescriptions = {}; // name -> description
let institutionsData = {}; // name -> [institutions] (now supports multiple)
let institutionsList = new Set(); // unique institutions
let friendshipsData = {}; // name -> [friendships] (supports multiple)
let friendshipsList = new Set(); // unique friendships

// Race color mapping
const raceColors = {
    'hunter': '#94655D',
    'werewolf': '#434F3F',
    'hybrid': '#524047',
    'witch': '#405752',
    'human': '#4C4957',
    'vampire': '#944444',
    'volturi': '#664E64',
    'vampire': '#7B403B',
    'hunterwitch': '#94655D', // Using first color for text
    'vampirehunter': '#7B403B', // Using first color for text
    'vampirewitch': '#405752', // Using first color for text
    'supernaturalhuman': '#756059', // Using first color for text
    'hybridhunter': '#94655D', // Using first color for text
    'pet': '#d4bc85' // New race "pet" with its color
};

// SVG setup
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Initialize zoom behavior with slower, smoother transitions
const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on("zoom", zoomed);

// Create container for zoom
const container = svg.append("g");

// Apply zoom to SVG with slower transition
svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(0.2).translate(width/4, height/4));

function zoomed(event) {
    container.attr("transform", event.transform);
}

// Function to calculate age from date of birth and date of death
function calculateAge(dob, dod) {
    if (!dob || dob === '...') return '...';
    
    // Check for BC dates first
    const bcMatch = dob.match(/(\d+)\s*BC/i);
    if (bcMatch) {
        const bcYear = parseInt(bcMatch[1]);
        const currentYear = new Date().getFullYear();
        return (currentYear + bcYear).toString();
    }
    
    // Try to parse other date formats
   const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // Normalize string (e.g., trim, uppercase)
    const trimmed = dateStr.trim().toUpperCase();

    // Check for BC
    const bcMatch = trimmed.match(/^(\d+)\s*BC$/);
    if (bcMatch) {
        return { year: -parseInt(bcMatch[1], 10) };
    }

    // Check for AD (optional suffix)
    const adMatch = trimmed.match(/^(\d+)\s*(AD)?$/);
    if (adMatch) {
        return { year: parseInt(adMatch[1], 10) };
    }

    // Check for MM/DD/YYYY
    const usDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
    if (usDate) {
        return {
            year: parseInt(usDate[3], 10),
            month: parseInt(usDate[1], 10),
            day: parseInt(usDate[2], 10)
        };
    }

    // Check for YYYY-MM-DD
    const isoDate = trimmed.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/);
    if (isoDate) {
        return {
            year: parseInt(isoDate[1], 10),
            month: parseInt(isoDate[2], 10),
            day: parseInt(isoDate[3], 10)
        };
    }

    return null;
};
    
    const birthInfo = parseDate(dob);
    if (!birthInfo) return '...';
    
    // If there's a date of death, calculate age at death
    if (dod && dod !== '...') {
        const deathInfo = parseDate(dod);
        if (!deathInfo) return '...';
        
        // If both dates have full information
        if (birthInfo.month && birthInfo.day && deathInfo.month && deathInfo.day) {
            let age = deathInfo.year - birthInfo.year;
            
            // Check if birthday had occurred by death date
            if (deathInfo.month < birthInfo.month || 
                (deathInfo.month === birthInfo.month && deathInfo.day < birthInfo.day)) {
                age--;
            }
            
            return age.toString();
        } else if (birthInfo.year && deathInfo.year) {
            // Only years available
            return (deathInfo.year - birthInfo.year).toString();
        }
        
        return '...';
    }
    
    // No date of death - calculate current age
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    if (birthInfo.month && birthInfo.day) {
        // Full date available
        let age = currentYear - birthInfo.year;
        
        // Check if birthday has occurred this year
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        if (currentMonth < birthInfo.month || 
            (currentMonth === birthInfo.month && currentDay < birthInfo.day)) {
            age--;
        }
        
        return age.toString();
    } else if (birthInfo.year) {
        // Only year available
        return (currentYear - birthInfo.year).toString();
    }
    
    return '...';
}

// Separate function for data processing
function processData(pointsText, linksText) {
    const pointsLines = pointsText.split('\n').filter(line => line.trim());
    console.log("Number of points:", pointsLines.length);

    // Process nodes - now including date of birth, personality, and date of death
    nodes = pointsLines.map(line => {
        const parts = line.split('\t');
        const name = parts[0];
        const image = parts[1];
        const race = parts[2]?.trim().toLowerCase();
        const dob = parts[3] || '...';
        const dod = parts[5] || '...'; 
      // Changed from parts[5] to parts[4]
        const personality = parts[4] || '...';  // Changed from parts[4] to parts[5]
        const additional = parts[6] || '...'; // New additional field from column 6
const job = parts[7] || '';

        const age = calculateAge(dob, dod);
        
        validNodeNames.add(name);
        return { 
            id: name, 
            name: name, 
            image: image, 
            race: race, 
            dob: dob,
            personality: personality,
            dod: dod,
            age: age,
            additional: additional,
            job: job// Added as the last field

        };
    });

    // Process links
    const linksLines = linksText.split('\n').filter(line => line.trim());
    links = linksLines.map(line => {
        const [source, target, relationship, type] = line.split('\t');
        return { source, target, relationship, type };
    }).filter(link => {
        const isValid = validNodeNames.has(link.source) && validNodeNames.has(link.target);
        if (!isValid) {
            console.warn('Skipping invalid link:', link);
        }
        return isValid;
    });

    // Initialize simulation with less force for smoother movement
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(500).strength(0.1)) // Reduced strength
        .force("charge", d3.forceManyBody().strength(-1500).distanceMin(200)) // Reduced strength
        .force("collision", d3.forceCollide().radius(150).strength(0.3)) // Reduced strength
        .alphaDecay(0.02); // Slower decay for smoother settling

    // Initialize drag behavior after simulation exists
    drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.2).restart(); // Reduced alpha target
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    console.log("Processed nodes:", nodes);
    console.log("Processed links:", links);
    
    // Create visualization elements here
    createVisualization();
}

function createVisualization() {
    // Create gradients for mixed races
    const defs = svg.append("defs");
    
    // Hunter-Witch gradient
    defs.append("linearGradient")
        .attr("id", "hunterwitch-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#94655D"},
            {offset: "100%", color: "#405752"}
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    
    // Vampire-Hunter gradient
    defs.append("linearGradient")
        .attr("id", "vampirehunter-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#7B403B"},
            {offset: "100%", color: "#94655D"}
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    
    // Vampire-Witch gradient
    defs.append("linearGradient")
        .attr("id", "vampirewitch-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#405752"},
            {offset: "100%", color: "#803131"}
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    
    // Supernatural-Human gradient
    defs.append("linearGradient")
        .attr("id", "supernaturalhuman-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#756059"},
            {offset: "100%", color: "#4C4957"}
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    
    // Hybrid-Hunter gradient
    defs.append("linearGradient")
        .attr("id", "hybridhunter-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#94655D"},
            {offset: "100%", color: "#524047"}
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // Create arrow markers for each link type
    const linkTypes = [...new Set(links.map(d => d.type))];
    linkTypes.forEach(type => {
        defs.append("marker")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 25)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("xoverflow", "visible")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class", `arrowhead-${type}`);
    });

    // Create labels first (will be behind links)
    labelGroups = container.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "label-group");

    // Add labels with race-based colors
    labelGroups.append("text")
        .attr("class", "node-label")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("dy", "40")
        .style("fill", d => raceColors[d.race] || "#292725");

    // Create links (will appear on top of labels)
    link = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", d => `relationship-${d.type}`)
        .attr("stroke-width", 2)
        .attr("marker-end", d => `url(#arrowhead-${d.type})`);

    // Create nodes (will appear on top of both labels and links)
    const nodeGroup = container.append("g")
        .attr("class", "nodes");

    // Create nodes with updated event handlers
    node = nodeGroup
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "node")
       .on("click", function(event, d) {
    event.stopPropagation();

    if (selectedNode === d) {
        selectedNode = null;
        resetNodeStates();
        hideTooltip();
        d3.selectAll(".character-card").classed("selected", false);
        applyFilters(); // Reapply filters instead of clearing search
    } else {
        selectedNode = d;
        highlightNodeAndConnections(d);
        centerOnNode(d);
        hideTooltip();

        // Highlight the matching character card
        d3.selectAll(".character-card").classed("selected", card => card.name === d.name);

        // Scroll the selected card into view
 document.querySelectorAll(".character-card").forEach(card => {
            const nameEl = card.querySelector(".character-name");
             if (nameEl && nameEl.textContent.trim() === d.name) {
        const rect = card.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = rect.top + scrollTop - 250; // Scroll so the element is 260px from the top
        window.scrollTo({ top: offset, behavior: "smooth" });
            }
        });

        // Update the search input with the selected name
        const input = document.querySelector('.search-input');
        if (input) {
            input.value = d.name;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
})
  
        .on("mouseover", function(event, d) {
            if (!selectedNode) { // Only show hover effects if no node is selected
                const connectedNodes = new Set([d.id]);
                links.forEach(link => {
                    if (link.source.id === d.id) connectedNodes.add(link.target.id);
                    if (link.target.id === d.id) connectedNodes.add(link.source.id);
                });

                labelGroups.classed("visible", n => connectedNodes.has(n.id));
                node.classed("highlighted", n => connectedNodes.has(n.id))
                    .classed("faded", n => !connectedNodes.has(n.id));
                link.classed("highlighted", l => l.source.id === d.id || l.target.id === d.id)
                    .classed("faded", l => l.source.id !== d.id && l.target.id !== d.id);
                
                // Highlight the label on hover
                d3.select(this).select(".node-label")
                    .style("font-weight", "bold")
                    .style("font-size", "1.2em");
                
                // Show tooltip on hover
                showTooltip(d, event);
            }
        })
        .on("mouseout", function(event, d) {
            if (!selectedNode) { // Only reset if no node is selected
                resetNodeStates();
                // Reset the label style
                d3.select(this).select(".node-label")
                    .style("font-weight", "normal")
                    .style("font-size", "1em");
                
                // Hide tooltip
                hideTooltip();
            }
        });

    // Add images to nodes
    node.append("image")
        .attr("xlink:href", d => d.image)
        .attr("width", 160)
        .attr("height", 160)
        .attr("x", -80)
        .attr("y", -80)
        .attr("class", "node-image")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", (d, i) => `url(#circle-clip-${i})`);

    // Add clip paths
    node.append("clipPath")
        .attr("id", (d, i) => `circle-clip-${i}`)
        .append("circle")
        .attr("r", 80);

    // Add border circles (now just a simple border)
    node.append("circle")
        .attr("r", 80)
        .attr("class", "node-circle")
        .style("stroke", "#292725")
        .style("stroke-width", "2px")
        .style("fill", "none");

    // Add drag behavior
    node.call(drag);

    // Add click handler to SVG to deselect when clicking elsewhere
    svg.on("click", function () {
    if (selectedNode) {
        selectedNode = null;
        resetNodeStates();
        hideTooltip();
        applyFilters(); // Reapply filters instead of clearing search

        // Remove highlight from character cards
        d3.selectAll(".character-card").classed("selected", false);
    }
});


    // Update the simulation's tick handler with curved links for multiple connections
    simulation.on("tick", () => {
        // Group links by source-target pairs to handle multiple links
        const linkGroups = {};
        links.forEach(link => {
            const key = [link.source.id, link.target.id].sort().join('-');
            if (!linkGroups[key]) {
                linkGroups[key] = [];
            }
            linkGroups[key].push(link);
        });

        // Update link positions with offsets for multiple links
        link.each(function(d) {
            const key = [d.source.id, d.target.id].sort().join('-');
            const group = linkGroups[key];
            const index = group.indexOf(d);
            const total = group.length;
            
            // Calculate offset based on position in group
            const offset = (index - (total - 1) / 2) * 10;
            
            // Calculate angle between nodes
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const angle = Math.atan2(dy, dx);
            
            // Calculate perpendicular offset
            const offsetX = Math.sin(angle) * offset;
            const offsetY = -Math.cos(angle) * offset;
            
            // Apply offset to line positions
            d3.select(this)
                .attr("x1", d.source.x + offsetX)
                .attr("y1", d.source.y + offsetY)
                .attr("x2", d.target.x + offsetX)
                .attr("y2", d.target.y + offsetY);
        });

        node.attr("transform", d => `translate(${d.x},${d.y})`);

        // Update label positions
        labelGroups.attr("transform", d => {
            const pos = calculateLabelPosition(d, nodes, []);
            return `translate(${d.x + pos.x},${d.y + pos.y})`;
        });
    });
}

function resetNodeStates() {
    labelGroups.classed("visible", false);
    node.classed("highlighted", false)
        .classed("faded", false)
        .classed("selected", false);
    link.classed("highlighted", false)
        .classed("faded", false);
    
    // Reset all labels to normal style
    labelGroups.select(".node-label")
        .style("font-weight", "normal")
        .style("font-size", "1em");
}

function highlightNodeAndConnections(d) {
    const connectedNodes = new Set([d.id]);
    links.forEach(link => {
        if (link.source.id === d.id) connectedNodes.add(link.target.id);
        if (link.target.id === d.id) connectedNodes.add(link.source.id);
    });

    // Reset all states first
    resetNodeStates();
    
    // Then apply selected and connected states
    node.classed("selected", n => n === d)
        .classed("highlighted", n => connectedNodes.has(n.id))
        .classed("faded", n => !connectedNodes.has(n.id) && n !== d);
    
    link.classed("highlighted", l => l.source.id === d.id || l.target.id === d.id)
        .classed("faded", l => l.source.id !== d.id && l.target.id !== d.id);
    
    labelGroups.classed("visible", n => connectedNodes.has(n.id));
    
    // Highlight the selected node's label
    if (d) {
        labelGroups.filter(n => n.id === d.id).select(".node-label")
            .style("font-weight", "bold")
            .style("font-size", "1.2em");
    }
}

// Tooltip functions
function showTooltip(d, event) {
    const tooltip = d3.select("#node-tooltip");
    if (tooltip.empty()) {
        d3.select("body").append("div")
            .attr("id", "node-tooltip")
            .attr("class", "node-tooltip");
    }
    
    // Prepare tooltip content
    let tooltipContent = `<div class="tooltip-header">${d.name}</div>`;
    
    // Add race if available
    if (d.race && d.race !== '...') {
        tooltipContent += `<div class="tooltip-row"><i>${d.race}</i></div>`;
    }
    
    // Add date of birth if available
    if (d.dob && d.dob !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Born:</strong> ${d.dob}</div>`;
    }
    
    // Add date of death if available
    if (d.dod && d.dod !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Died:</strong> ${d.dod}</div>`;
    }
    
    // Add age if available
    if (d.age && d.age !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Age:</strong> ${d.age}</div>`;
    }
    
    // Add personality type if available
    if (d.personality && d.personality !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Personality type:</strong> ${d.personality}</div>`;
    }
  if (d.additional && d.additional !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong><div class="styled-line"></div></strong><div class="additional-content">${d.additional}</div>`;
    }
    
    d3.select("#node-tooltip")
        .html(tooltipContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1);
}

function hideTooltip() {
    d3.select("#node-tooltip")
        .style("opacity", 0)
        .style("left", "0px")
        .style("top", "0px");
}

// Load and process data from GitHub
Promise.all([
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/avatarai.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/Points.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/aprasymai.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/institutions.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/sort%20by%20friends.txt')
]).then(function([pointsText, linksText, descriptionText, institutionsText, friendshipsText]) {
    // Process descriptions
    const descLines = descriptionText.split('\n').filter(line => line.trim());
    descLines.forEach(line => {
        const [name, description] = line.split('\t');
        if (name && description) {
            characterDescriptions[name.trim()] = description.trim();
        }
    });

    // Process institutions - now supports multiple institutions per person
    const instLines = institutionsText.split('\n').filter(line => line.trim());
    instLines.forEach(line => {
        const parts = line.split('\t');
        const name = parts[0]?.trim();
        const institutions = parts.slice(1).filter(x => x.trim());
        
        if (name && institutions.length > 0) {
            institutionsData[name] = institutions.map(i => i.trim());
            institutions.forEach(institution => {
                institutionsList.add(institution.trim());
            });
        }
    });

    // Process friendships data - supports multiple friendships per person
    const friendshipLines = friendshipsText.split('\n').filter(line => line.trim());
    friendshipLines.forEach(line => {
        const parts = line.split('\t');
        const name = parts[0]?.trim();
        const friendships = parts.slice(1).filter(x => x.trim());
        
        if (name && friendships.length > 0) {
            friendshipsData[name] = friendships.map(f => f.trim());
            friendships.forEach(friendship => {
                friendshipsList.add(friendship.trim());
            });
        }
    });

    processData(pointsText, linksText);
    populateCharacterList();
    populateInstitutionFilter();
    populateFriendshipFilter();
    setupClearFiltersButton();
}).catch(error => {
    console.error("Error loading or processing data:", error);
});

// Function to populate the institution filter
function populateInstitutionFilter() {
    const institutionFilter = d3.select("#institution-filter");
    
    // Clear existing options except the first one
    institutionFilter.selectAll("option:not(:first-child)").remove();
    
    // Add options for each unique institution
    Array.from(institutionsList).sort().forEach(institution => {
        institutionFilter.append("option")
            .attr("value", institution)
            .text(institution);
    });
    
    // Set up filter handler that works with race filter
    institutionFilter.on("change", function() {
        applyFilters();
    });
}

// Function to populate the friendship filter
function populateFriendshipFilter() {
    const friendshipFilter = d3.select("#friendship-filter");
    
    // Clear existing options except the first one
    friendshipFilter.selectAll("option:not(:first-child)").remove();
    
    // Add options for each unique friendship
    Array.from(friendshipsList).sort().forEach(friendship => {
        friendshipFilter.append("option")
            .attr("value", friendship)
            .text(friendship);
    });
    
    // Set up filter handler
    friendshipFilter.on("change", function() {
        applyFilters();
    });
}

// Function to set up the clear filters button
function setupClearFiltersButton() {
    const clearFiltersButton = d3.select("#clear-filters");
    if (clearFiltersButton.empty()) {
        // Add the button if it doesn't exist
        d3.select(".prilipdytas").append("button")
            .attr("id", "clear-filters")
            .attr("class", "clear-filters-button")
            .text("Clear Filters")
            .on("click", function() {
                // Reset all filters to "all"
                d3.select("#race-filter").node().value = "all";
                d3.select("#institution-filter").node().value = "all";
                d3.select("#friendship-filter").node().value = "all";
                
                // Apply filters (which will show all characters)
                applyFilters();
            });
    }
}

// Function to apply all filters (race, institution, and friendship)
function applyFilters() {
    const selectedRace = d3.select("#race-filter").node().value;
    const selectedInstitution = d3.select("#institution-filter").node().value;
    const selectedFriendship = d3.select("#friendship-filter").node().value;
    
    d3.select("#characters-container").selectAll(".character-card")
        .style("display", d => {
            // Check race filter
            const raceMatch = selectedRace === "all" || d.race === selectedRace;
            
            // Check institution filter
            const institutionMatch = selectedInstitution === "all" || 
                (institutionsData[d.name] && 
                 institutionsData[d.name].includes(selectedInstitution));
            
            // Check friendship filter
            const friendshipMatch = selectedFriendship === "all" || 
                (friendshipsData[d.name] && 
                 friendshipsData[d.name].includes(selectedFriendship));
            
            return raceMatch && institutionMatch && friendshipMatch ? "flex" : "none";
        });
}

// Function to populate the character list
function populateCharacterList() {
    const container = d3.select("#characters-container");
    
    // Clear existing content
    container.html("");
    
    // Sort characters alphabetically
    const sortedNodes = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Create character cards
    const characterCards = container.selectAll(".character-card")
        .data(sortedNodes)
        .enter()
        .append("div")
        .attr("class", "character-card")
        .on("click", function(event, d) {
            event.stopPropagation();
            
            // Check if this card is already selected
            const isSelected = d3.select(this).classed("selected");
            
            // Toggle selection state
            d3.selectAll(".character-card").classed("selected", false);
            d3.select(this).classed("selected", !isSelected);
            
            // Remove any existing description
            const oldDesc = document.querySelector('.character-description-below');
            if (oldDesc) oldDesc.remove();
            
            // If the card is now selected, show description
            if (!isSelected) {
                selectNode(d);
            } else {
                // If deselected, reset the view but maintain filters
                selectedNode = null;
                resetNodeStates();
                hideTooltip();
                applyFilters(); // Reapply filters instead of clearing search
            }
        });
    
    // Add character images
    characterCards.append("img")
        .attr("class", "character-image")
        .attr("src", d => d.image)
        .attr("alt", d => d.name);
    
    // Add character info
    const infoDivs = characterCards.append("div")
        .attr("class", "character-info");
    
    infoDivs.append("div")
        .attr("class", "character-name")
        .text(d => d.name);
    
    const detailsDivs = infoDivs.append("div")
        .attr("class", "character-details");
    
    // Add race
    detailsDivs.append("span")
        .attr("class", "character-race")
        .text(d => d.race || "unknown")
        .style("background-color", d => raceColors[d.race] || "#666")
        .style("color", "white");
    
   /* // Add institution(s) if available
    detailsDivs.each(function(d) {
        const details = d3.select(this);
        if (institutionsData[d.name] && institutionsData[d.name].length > 0) {
            details.append("span")
                .attr("class", "character-institution")
                .text(institutionsData[d.name].join(", "))
                .style("margin-left", "8px")
                .style("font-style", "italic");
        }
    });*/
    
    // Add age display with deceased indicator if applicable
    const ageSpans = detailsDivs.append("span")
        .attr("class", "age-display");

    ageSpans.each(function(d) {
        const span = d3.select(this);
        if (d.dob && d.dob !== '...') {
            if (d.dod && d.dod !== '...') {
                span.append("span")
                    .attr("class", "deceased")
                    .text("✟ ");
            }
            span.append("span")
                .text(`Age: ${d.age}`);
        }
    });
    // Add job
    detailsDivs.append("span")
    .attr("class", "job")
    .text(d => d.job || "")
    .style("margin-top", "5px"); // Adding margin-top of 5 pixels
    // Set up race filter to work with institution filter
    d3.select("#race-filter").on("change", function() {
        applyFilters();
    });
}

// Helper functions
function calculateLabelPosition(d, nodes, existingLabels) {
    const nodeRadius = 80;
    const labelHeight = 20;
    const verticalPadding = -5;
    
    const basePosition = {
        x: 0,
        y: nodeRadius + verticalPadding
    };

    const labelX = d.x + basePosition.x;
    const labelY = d.y + basePosition.y;
    const newLabelRect = getLabelRect(labelX, labelY);

    let hasOverlap = existingLabels.some(existing => 
        doLabelsOverlap(newLabelRect, existing)
    );

    if (!hasOverlap) {
        existingLabels.push(newLabelRect);
        return basePosition;
    }

    for (let offset = -5; offset <= 5; offset += 5) {
        if (offset === 0) continue;

        const testPos = {
            x: basePosition.x,
            y: basePosition.y + offset
        };

        const testX = d.x + testPos.x;
        const testY = d.y + testPos.y;
        const testRect = getLabelRect(testX, testY);

        hasOverlap = existingLabels.some(existing => 
            doLabelsOverlap(testRect, existing)
        );

        if (!hasOverlap) {
            existingLabels.push(testRect);
            return testPos;
        }
    }

    return {
        x: basePosition.x,
        y: basePosition.y + 5
    };
}

function searchCharacters(query) {
    if (!query) {
        // If search is empty, hide results and show all characters
        d3.selectAll(".character-card").style("display", "flex");
        return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter nodes that match the search query
    const matches = nodes.filter(node => 
        node.name.toLowerCase().includes(lowerQuery) ||
        (node.race && node.race.toLowerCase().includes(lowerQuery)) ||
        (node.personality && node.personality.toLowerCase().includes(lowerQuery)) ||
        (institutionsData[node.name] && 
         institutionsData[node.name].some(i => i.toLowerCase().includes(lowerQuery))) ||
        (friendshipsData[node.name] && 
         friendshipsData[node.name].some(f => f.toLowerCase().includes(lowerQuery)))
    );

    // Update character cards visibility
    d3.selectAll(".character-card")
        .style("display", d => 
            matches.some(match => match.id === d.id) ? "flex" : "none"
        );

    // If there's exactly one match, select it
    if (matches.length === 1) {
        selectNode(matches[0]);
    }
}

function getLabelRect(x, y, width = 100, height = 20) {
    return {
        x: x - width/2,
        y: y,
        width: width,
        height: height
    };
}

function doLabelsOverlap(rect1, rect2, padding = 5) {
    return !(rect1.x + rect1.width + padding < rect2.x || 
            rect1.x > rect2.x + rect2.width + padding || 
            rect1.y + rect1.height + padding < rect2.y || 
            rect1.y > rect2.y + rect2.height + padding);
}

function selectNode(node) {
    // Highlight the node and its connections
    highlightNodeAndConnections(node);
    // Show description below the selected character card
    const container = document.getElementById('characters-container');

    // Remove previous description element if any
    const oldDesc = document.querySelector('.character-description-below');
    if (oldDesc) oldDesc.remove();

    // Find the selected card's DOM element
    document.querySelectorAll(".character-card").forEach(card => {
        const nameEl = card.querySelector(".character-name");
        if (nameEl && nameEl.textContent.trim() === node.name) {
            const desc = characterDescriptions[node.name] || "No description available.";

            const descEl = document.createElement("div");
            descEl.className = "character-description-below";
            descEl.textContent = desc;

            // Insert description directly after the card
            card.insertAdjacentElement('afterend', descEl);
        }
    });

    // Center the view on the node
    centerOnNode(node);
    
    // Update search input and hide results
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    if (searchInput) searchInput.value = node.name;
    if (searchResults) searchResults.style.display = 'none';
}

function centerOnNode(selectedNode) {
    // First, find all connected nodes
    const connectedNodes = new Set([selectedNode]);
    links.forEach(link => {
        if (link.source.id === selectedNode.id) {
            connectedNodes.add(link.target);
        } else if (link.target.id === selectedNode.id) {
            connectedNodes.add(link.source);
        }
    });

    // Calculate the bounding box of selected node and its connections
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    connectedNodes.forEach(node => {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    });

    // Add padding around the bounding box
    const padding = 150; // Increased padding to reduce zoom level
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    // Calculate required scale to fit the bounding box
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    const scale = Math.min(
        Math.max(0.2, Math.min(width / boxWidth, height / boxHeight)), // Minimum zoom level of 0.2
        0.8 // Maximum zoom level of 0.8 (prevents zooming in too much)
    );

    // Calculate center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate translation to center the bounding box
    const x = width/2 - centerX * scale;
    const y = height/2 - centerY * scale;

    // Animate to the new view with slower transition
    svg.transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity
            .translate(x, y)
            .scale(scale));
}

// Add clear search functionality
document.querySelectorAll('.clear-search').forEach(button => {
    button.addEventListener('click', function() {
        const searchContainer = this.closest('.search-container');
        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.value = '';
        searchInput.focus();
        
        // Trigger the input event to update the search results
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        searchInput.dispatchEvent(event);
        
        // Hide the clear button
        this.style.display = 'none';
    });
});

// Show/hide clear button based on input
document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', function() {
        const clearButton = this.nextElementSibling;
        if (this.value.length > 0) {
            clearButton.style.display = 'block';
            searchCharacters(this.value);
        } else {
            clearButton.style.display = 'none';
            // Reset view when search is cleared
            searchCharacters('');
            if (selectedNode) {
                selectedNode = null;
                resetNodeStates();
                hideTooltip();
            }
        }
    });
});

// Add scroll functionality for the up and down buttons
document.addEventListener("DOMContentLoaded", function() {
    const scrollUpButton = document.querySelector('.scroll-up-button');
    const scrollDownButton = document.querySelector('.scroll-down-button');
    const characterList = document.querySelector('.character-list');

    // Make sure buttons exist
    if (scrollUpButton && scrollDownButton && characterList) {
        // Make buttons visible all the time
        scrollUpButton.style.display = 'flex';
        scrollDownButton.style.display = 'flex';

        // Scroll to top when up button is clicked
        scrollUpButton.addEventListener('click', function() {
            characterList.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Scroll to bottom when down button is clicked
        scrollDownButton.addEventListener('click', function() {
            characterList.scrollTo({
                top: characterList.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener("click", function(event) {
    const isCard = event.target.closest(".character-card");
    const isDesc = event.target.closest(".character-description-below");

    if (!isCard && !isDesc) {
        const oldDesc = document.querySelector('.character-description-below');
        if (oldDesc) oldDesc.remove();

        // Also remove card highlight
        d3.selectAll(".character-card").classed("selected", false);

        // Clear selected node state if needed
        if (selectedNode) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
        }
    }
});
