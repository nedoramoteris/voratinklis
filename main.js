[file name]: main.js
[file content begin]
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
        // Move buttons to the left
        document.querySelectorAll('.dark-mode-toggle, .hide-list-toggle, .scroll-up-button, .scroll-down-button')
            .forEach(button => {
                button.style.left = "20px";
            });
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
            
            // Move buttons to the left
            document.querySelectorAll('.dark-mode-toggle, .hide-list-toggle, .scroll-up-button, .scroll-down-button')
                .forEach(button => {
                    button.style.left = "20px";
                });
        } else {
            characterList.style.display = "block";
            localStorage.setItem("listVisible", "true");
            listToggle.innerText = "☰";
            
            // Move buttons back to their original positions
            document.querySelectorAll('.dark-mode-toggle').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.hide-list-toggle').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.scroll-up-button').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.scroll-down-button').forEach(btn => btn.style.left = "268px");
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
let drag;
let selectedNode = null;
let characterDescriptions = {};
let institutionsData = {};
let institutionsList = new Set();
let friendshipsData = {};
let friendshipsList = new Set();
let countriesData = {};
let animationFrameId = null;
let lastTickTime = 0;
const TICK_INTERVAL = 16; // ~60fps

// Cache DOM elements
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const container = svg.append("g");

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
    'hunterwitch': '#94655D',
    'vampirehunter': '#7B403B',
    'vampirewitch': '#405752',
    'supernaturalhuman': '#756059',
    'hybridhunter': '#94655D',
    'pet': '#d4bc85'
};

// Optimized zoom with debouncing
const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on("zoom", function(event) {
        requestAnimationFrame(() => {
            container.attr("transform", event.transform);
        });
    });

svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(0.2).translate(width/4, height/4));

// Function to calculate age from date of birth and date of death
function calculateAge(dob, dod) {
    if (!dob || dob === '...') return '...';
    
    const bcMatch = dob.match(/(\d+)\s*BC/i);
    if (bcMatch) {
        const bcYear = parseInt(bcMatch[1]);
        const currentYear = new Date().getFullYear();
        return (currentYear + bcYear).toString();
    }
    
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const trimmed = dateStr.trim().toUpperCase();

        const bcMatch = trimmed.match(/^(\d+)\s*BC$/);
        if (bcMatch) return { year: -parseInt(bcMatch[1], 10) };

        const adMatch = trimmed.match(/^(\d+)\s*(AD)?$/);
        if (adMatch) return { year: parseInt(adMatch[1], 10) };

        const usDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
        if (usDate) {
            return {
                year: parseInt(usDate[3], 10),
                month: parseInt(usDate[1], 10),
                day: parseInt(usDate[2], 10)
            };
        }

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
    
    if (dod && dod !== '...') {
        const deathInfo = parseDate(dod);
        if (!deathInfo) return '...';
        
        if (birthInfo.month && birthInfo.day && deathInfo.month && deathInfo.day) {
            let age = deathInfo.year - birthInfo.year;
            if (deathInfo.month < birthInfo.month || 
                (deathInfo.month === birthInfo.month && deathInfo.day < birthInfo.day)) {
                age--;
            }
            return age.toString();
        } else if (birthInfo.year && deathInfo.year) {
            return (deathInfo.year - birthInfo.year).toString();
        }
        return '...';
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    if (birthInfo.month && birthInfo.day) {
        let age = currentYear - birthInfo.year;
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        if (currentMonth < birthInfo.month || 
            (currentMonth === birthInfo.month && currentDay < birthInfo.day)) {
            age--;
        }
        return age.toString();
    } else if (birthInfo.year) {
        return (currentYear - birthInfo.year).toString();
    }
    
    return '...';
}

// Optimized data processing
function processData(pointsText, linksText) {
    const pointsLines = pointsText.split('\n').filter(line => line.trim());
    
    // Process nodes
    nodes = pointsLines.map(line => {
        const parts = line.split('\t');
        const name = parts[0];
        const image = parts[1];
        const race = parts[2]?.trim().toLowerCase();
        const dob = parts[3] || '...';
        const dod = parts[5] || '...';
        const personality = parts[4] || '...';
        const additional = parts[6] || '...';
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
            job: job
        };
    });

    // Process links
    const linksLines = linksText.split('\n').filter(line => line.trim());
    links = linksLines.map(line => {
        const [source, target, relationship, type] = line.split('\t');
        return { source, target, relationship, type: parseInt(type) || 0 };
    }).filter(link => {
        return validNodeNames.has(link.source) && validNodeNames.has(link.target);
    });

    // Pre-calculate link groups for curved links
    const linkGroups = {};
    links.forEach(link => {
        const key = [link.source, link.target].sort().join('-');
        if (!linkGroups[key]) linkGroups[key] = [];
        linkGroups[key].push(link);
    });

    // Store link group info on each link for quick access
    links.forEach(link => {
        const key = [link.source, link.target].sort().join('-');
        link.group = linkGroups[key];
        link.groupIndex = linkGroups[key].indexOf(link);
    });

    // Create visualization
    createVisualization();
}

function createVisualization() {
    // Create gradients for mixed races
    const defs = svg.append("defs");
    
    const gradients = {
        'hunterwitch': [['0%', '#94655D'], ['100%', '#405752']],
        'vampirehunter': [['0%', '#7B403B'], ['100%', '#94655D']],
        'vampirewitch': [['0%', '#405752'], ['100%', '#803131']],
        'supernaturalhuman': [['0%', '#756059'], ['100%', '#4C4957']],
        'hybridhunter': [['0%', '#94655D'], ['100%', '#524047']]
    };

    Object.entries(gradients).forEach(([name, stops]) => {
        defs.append("linearGradient")
            .attr("id", `${name}-gradient`)
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .selectAll("stop")
            .data(stops)
            .enter().append("stop")
            .attr("offset", d => d[0])
            .attr("stop-color", d => d[1]);
    });

    // Create arrow markers
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

    // Create labels
    labelGroups = container.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "label-group");

    labelGroups.append("text")
        .attr("class", "node-label")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("dy", "40")
        .style("fill", d => raceColors[d.race] || "#292725");

    // Create links
    link = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", d => `relationship-${d.type}`)
        .attr("stroke-width", 2)
        .attr("marker-end", d => `url(#arrowhead-${d.type})`);

    // Create nodes
    const nodeGroup = container.append("g").attr("class", "nodes");

    // Pre-create clip paths
    const clipDefs = defs.append("defs");
    nodes.forEach((d, i) => {
        clipDefs.append("clipPath")
            .attr("id", `circle-clip-${i}`)
            .append("circle")
            .attr("r", 80);
    });

    node = nodeGroup
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .call(createDragBehavior());

    // Add images with cached clip paths
    node.append("image")
        .attr("xlink:href", d => d.image)
        .attr("width", 160)
        .attr("height", 160)
        .attr("x", -80)
        .attr("y", -80)
        .attr("class", "node-image")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", (d, i) => `url(#circle-clip-${i})`);

    // Add border circles
    node.append("circle")
        .attr("r", 80)
        .attr("class", "node-circle")
        .style("stroke", "#292725")
        .style("stroke-width", "2px")
        .style("fill", "none");

    // Setup optimized simulation
    setupSimulation();

    // Add optimized event handlers
    setupNodeEvents();
    
    // Add SVG click handler
    svg.on("click", function () {
        if (selectedNode) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
            applyFilters();
            d3.selectAll(".character-card").classed("selected", false);
        }
    });
}

function setupSimulation() {
    // Stop any existing simulation
    if (simulation) {
        simulation.stop();
        simulation = null;
    }

    // Create new simulation with optimized settings
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(500)
            .strength(0.1))
        .force("charge", d3.forceManyBody()
            .strength(-1500)
            .distanceMin(200))
        .force("collision", d3.forceCollide()
            .radius(150)
            .strength(0.3))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaDecay(0.02)
        .velocityDecay(0.4)
        .alphaMin(0.001);

    // Optimized tick handler with requestAnimationFrame throttling
    simulation.on("tick", () => {
        const now = performance.now();
        if (now - lastTickTime < TICK_INTERVAL) return;
        lastTickTime = now;

        requestAnimationFrame(() => {
            // Update links with optimized curved positioning
            link.each(function(d) {
                const total = d.group.length;
                const offset = (d.groupIndex - (total - 1) / 2) * 10;
                
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const angle = Math.atan2(dy, dx);
                
                const offsetX = Math.sin(angle) * offset;
                const offsetY = -Math.cos(angle) * offset;
                
                d3.select(this)
                    .attr("x1", d.source.x + offsetX)
                    .attr("y1", d.source.y + offsetY)
                    .attr("x2", d.target.x + offsetX)
                    .attr("y2", d.target.y + offsetY);
            });

            // Update nodes
            node.attr("transform", d => `translate(${d.x},${d.y})`);

            // Update labels with simplified positioning
            labelGroups.attr("transform", d => {
                return `translate(${d.x},${d.y + 75})`;
            });
        });
    });
}

function createDragBehavior() {
    drag = d3.drag()
        .on("start", function(event, d) {
            if (!event.active) simulation.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", function(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });
    
    return drag;
}

function setupNodeEvents() {
    // Single event delegation for better performance
    node.on("click", function(event, d) {
        event.stopPropagation();

        if (selectedNode === d) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
            d3.selectAll(".character-card").classed("selected", false);
            applyFilters();
        } else {
            selectedNode = d;
            highlightNodeAndConnections(d);
            centerOnNode(d);
            hideTooltip();

            d3.selectAll(".character-card").classed("selected", card => card.name === d.name);

            // Scroll to selected card
            document.querySelectorAll(".character-card").forEach(card => {
                const nameEl = card.querySelector(".character-name");
                if (nameEl && nameEl.textContent.trim() === d.name) {
                    const rect = card.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const offset = rect.top + scrollTop - 250;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            });

            const input = document.querySelector('.search-input');
            if (input) {
                input.value = d.name;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    // Optimized mouse events with throttling
    let hoverTimeout;
    node.on("mouseover", function(event, d) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (!selectedNode) {
                highlightNodeAndConnections(d);
                showTooltip(d, event);
            }
        }, 50);
    });

    node.on("mouseout", function(event, d) {
        clearTimeout(hoverTimeout);
        if (!selectedNode) {
            resetNodeStates();
            hideTooltip();
        }
    });
}

function resetNodeStates() {
    labelGroups.classed("visible", false);
    node.classed("highlighted", false)
        .classed("faded", false)
        .classed("selected", false);
    link.classed("highlighted", false)
        .classed("faded", false);
    
    labelGroups.select(".node-label")
        .style("font-weight", "normal")
        .style("font-size", "1em");
}

function highlightNodeAndConnections(d) {
    // Build adjacency map for faster lookups
    const adjacencyMap = new Map();
    links.forEach(link => {
        if (!adjacencyMap.has(link.source.id)) adjacencyMap.set(link.source.id, new Set());
        if (!adjacencyMap.has(link.target.id)) adjacencyMap.set(link.target.id, new Set());
        adjacencyMap.get(link.source.id).add(link.target.id);
        adjacencyMap.get(link.target.id).add(link.source.id);
    });

    const connectedNodes = new Set([d.id]);
    const connected = adjacencyMap.get(d.id);
    if (connected) {
        connected.forEach(nodeId => connectedNodes.add(nodeId));
    }

    // Reset all states first
    resetNodeStates();
    
    // Apply new states
    node.classed("selected", n => n === d)
        .classed("highlighted", n => connectedNodes.has(n.id))
        .classed("faded", n => !connectedNodes.has(n.id) && n !== d);
    
    link.classed("highlighted", l => connectedNodes.has(l.source.id) && connectedNodes.has(l.target.id))
        .classed("faded", l => !connectedNodes.has(l.source.id) || !connectedNodes.has(l.target.id));
    
    labelGroups.classed("visible", n => connectedNodes.has(n.id));
    
    if (d) {
        labelGroups.filter(n => n.id === d.id).select(".node-label")
            .style("font-weight", "bold")
            .style("font-size", "1.2em");
    }
}

// Optimized tooltip with caching
const tooltipCache = new Map();
function showTooltip(d, event) {
    if (!tooltipCache.has(d.id)) {
        let content = `<div class="tooltip-header">${d.name}</div>`;
        
        if (d.race && d.race !== '...') {
            content += `<div class="tooltip-row"><i>${d.race}</i></div>`;
        }
        
        if (d.dob && d.dob !== '...') {
            content += `<div class="tooltip-row"><strong>Born:</strong> ${d.dob}</div>`;
        }
        
        if (d.dod && d.dod !== '...') {
            content += `<div class="tooltip-row"><strong>Died:</strong> ${d.dod}</div>`;
        }
        
        if (d.age && d.age !== '...') {
            content += `<div class="tooltip-row"><strong>Age:</strong> ${d.age}</div>`;
        }
        
        if (d.personality && d.personality !== '...') {
            content += `<div class="tooltip-row"><strong>Personality type:</strong> ${d.personality}</div>`;
        }
        
        if (d.additional && d.additional !== '...') {
            content += `<div class="tooltip-row"><strong><div class="styled-line"></div></strong><div class="additional-content">${d.additional}</div>`;
        }
        
        tooltipCache.set(d.id, content);
    }

    let tooltip = d3.select("#node-tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div")
            .attr("id", "node-tooltip")
            .attr("class", "node-tooltip");
    }
    
    tooltip.html(tooltipCache.get(d.id))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1);
}

function hideTooltip() {
    d3.select("#node-tooltip")
        .style("opacity", 0);
}

// Load and process data
Promise.all([
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/avatarai.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/Points.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/aprasymai.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/institutions.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/sort%20by%20friends.txt'),
    d3.text('https://raw.githubusercontent.com/nedoramoteris/voratinklis/refs/heads/main/countries.txt')
]).then(function([pointsText, linksText, descriptionText, institutionsText, friendshipsText, countriesText]) {
    // Process descriptions
    const descLines = descriptionText.split('\n').filter(line => line.trim());
    descLines.forEach(line => {
        const [name, description] = line.split('\t');
        if (name && description) {
            characterDescriptions[name.trim()] = description.trim();
        }
    });

    // Process institutions
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

    // Process friendships
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

    // Process country data
    const countryLines = countriesText.split('\n').filter(line => line.trim());
    countryLines.forEach(line => {
        const [name, flagUrl] = line.split('\t');
        if (name && flagUrl) {
            countriesData[name.trim()] = flagUrl.trim();
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

function populateInstitutionFilter() {
    const institutionFilter = d3.select("#institution-filter");
    institutionFilter.selectAll("option:not(:first-child)").remove();
    
    Array.from(institutionsList).sort().forEach(institution => {
        institutionFilter.append("option")
            .attr("value", institution)
            .text(institution);
    });
    
    institutionFilter.on("change", function() {
        applyFilters();
    });
}

function populateFriendshipFilter() {
    const friendshipFilter = d3.select("#friendship-filter");
    friendshipFilter.selectAll("option:not(:first-child)").remove();
    
    Array.from(friendshipsList).sort().forEach(friendship => {
        friendshipFilter.append("option")
            .attr("value", friendship)
            .text(friendship);
    });
    
    friendshipFilter.on("change", function() {
        applyFilters();
    });
}

function setupClearFiltersButton() {
    const clearFiltersButton = d3.select("#clear-filters");
    if (clearFiltersButton.empty()) {
        d3.select(".prilipdytas").append("button")
            .attr("id", "clear-filters")
            .attr("class", "clear-filters-button")
            .text("Clear Filters")
            .on("click", function() {
                d3.select("#race-filter").node().value = "all";
                d3.select("#institution-filter").node().value = "all";
                d3.select("#friendship-filter").node().value = "all";
                applyFilters();
            });
    }
}

function applyFilters() {
    const selectedRace = d3.select("#race-filter").node().value;
    const selectedInstitution = d3.select("#institution-filter").node().value;
    const selectedFriendship = d3.select("#friendship-filter").node().value;
    
    d3.select("#characters-container").selectAll(".character-card")
        .style("display", d => {
            const raceMatch = selectedRace === "all" || d.race === selectedRace;
            const institutionMatch = selectedInstitution === "all" || 
                (institutionsData[d.name] && institutionsData[d.name].includes(selectedInstitution));
            const friendshipMatch = selectedFriendship === "all" || 
                (friendshipsData[d.name] && friendshipsData[d.name].includes(selectedFriendship));
            
            return raceMatch && institutionMatch && friendshipMatch ? "flex" : "none";
        });
}

function populateCharacterList() {
    const container = d3.select("#characters-container");
    container.html("");
    
    const sortedNodes = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
    
    const characterCards = container.selectAll(".character-card")
        .data(sortedNodes)
        .enter()
        .append("div")
        .attr("class", "character-card")
        .on("click", function(event, d) {
            event.stopPropagation();
            
            const isSelected = d3.select(this).classed("selected");
            d3.selectAll(".character-card").classed("selected", false);
            d3.select(this).classed("selected", !isSelected);
            
            const oldDesc = document.querySelector('.character-description-below');
            if (oldDesc) oldDesc.remove();
            
            if (!isSelected) {
                selectNode(d);
            } else {
                selectedNode = null;
                resetNodeStates();
                hideTooltip();
                applyFilters();
            }
        });
    
    characterCards.append("img")
        .attr("class", "character-image")
        .attr("src", d => d.image)
        .attr("alt", d => d.name);
    
    const infoDivs = characterCards.append("div")
        .attr("class", "character-info");
    
    const nameFlagDiv = infoDivs.append("div")
        .attr("class", "name-flag-container")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "5px");
    
    nameFlagDiv.append("div")
        .attr("class", "character-name")
        .text(d => d.name);
    
    nameFlagDiv.each(function(d) {
        if (countriesData[d.name]) {
            const flagContainer = d3.select(this).append("div")
                .attr("class", "flag-container")
                .style("display", "inline-block")
                .style("width", "16px")
                .style("height", "12px")
                .style("position", "relative");

            flagContainer.append("img")
                .attr("class", "country-flag")
                .attr("src", countriesData[d.name])
                .attr("alt", "Country flag")
                .style("width", "100%")
                .style("height", "100%")
                .style("object-fit", "cover")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0")
                .on("error", function() {
                    d3.select(this)
                        .attr("src", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2RkZCIgZD0iTTAgMGgxNnYxMkgweiIvPjwvc3ZnPg==")
                        .style("opacity", "0.5");
                });
        }
    });
    
    const detailsDivs = infoDivs.append("div")
        .attr("class", "character-details");
    
    detailsDivs.append("span")
        .attr("class", "character-race")
        .text(d => d.race || "unknown")
        .style("background-color", d => raceColors[d.race] || "#666")
        .style("color", "white");
    
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
    
    detailsDivs.append("span")
        .attr("class", "job")
        .text(d => d.job || "")
        .style("margin-top", "5px");
    
    d3.select("#race-filter").on("change", function() {
        applyFilters();
    });
}

function searchCharacters(query) {
    if (!query) {
        d3.selectAll(".character-card").style("display", "flex");
        return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = new Set();
    
    // Build search index
    nodes.forEach(node => {
        if (node.name.toLowerCase().includes(lowerQuery) ||
            (node.race && node.race.toLowerCase().includes(lowerQuery)) ||
            (node.personality && node.personality.toLowerCase().includes(lowerQuery)) ||
            (institutionsData[node.name] && institutionsData[node.name].some(i => i.toLowerCase().includes(lowerQuery))) ||
            (friendshipsData[node.name] && friendshipsData[node.name].some(f => f.toLowerCase().includes(lowerQuery)))) {
            matches.add(node.id);
        }
    });

    d3.selectAll(".character-card")
        .style("display", d => matches.has(d.id) ? "flex" : "none");

    if (matches.size === 1) {
        const match = nodes.find(n => matches.has(n.id));
        selectNode(match);
    }
}

function selectNode(node) {
    highlightNodeAndConnections(node);
    
    const oldDesc = document.querySelector('.character-description-below');
    if (oldDesc) oldDesc.remove();

    document.querySelectorAll(".character-card").forEach(card => {
        const nameEl = card.querySelector(".character-name");
        if (nameEl && nameEl.textContent.trim() === node.name) {
            const desc = characterDescriptions[node.name] || "No description available.";
            const descEl = document.createElement("div");
            descEl.className = "character-description-below";
            descEl.textContent = desc;
            card.insertAdjacentElement('afterend', descEl);
        }
    });

    centerOnNode(node);
    
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    if (searchInput) searchInput.value = node.name;
    if (searchResults) searchResults.style.display = 'none';
}

function centerOnNode(selectedNode) {
    const connectedNodes = new Set([selectedNode]);
    links.forEach(link => {
        if (link.source.id === selectedNode.id) {
            connectedNodes.add(link.target);
        } else if (link.target.id === selectedNode.id) {
            connectedNodes.add(link.source);
        }
    });

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    connectedNodes.forEach(node => {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    });

    const padding = 150;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    const scale = Math.min(
        Math.max(0.2, Math.min(width / boxWidth, height / boxHeight)),
        0.8
    );

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const x = width/2 - centerX * scale;
    const y = height/2 - centerY * scale;

    svg.transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity
            .translate(x, y)
            .scale(scale));
}

// Search functionality with throttling
let searchTimeout;
document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', function() {
        const clearButton = this.nextElementSibling;
        if (this.value.length > 0) {
            clearButton.style.display = 'block';
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchCharacters(this.value);
            }, 100);
        } else {
            clearButton.style.display = 'none';
            clearTimeout(searchTimeout);
            searchCharacters('');
            if (selectedNode) {
                selectedNode = null;
                resetNodeStates();
                hideTooltip();
            }
        }
    });
});

document.querySelectorAll('.clear-search').forEach(button => {
    button.addEventListener('click', function() {
        const searchContainer = this.closest('.search-container');
        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.value = '';
        searchInput.focus();
        
        const event = new Event('input', { bubbles: true, cancelable: true });
        searchInput.dispatchEvent(event);
        this.style.display = 'none';
    });
});

// Scroll functionality
document.addEventListener("DOMContentLoaded", function() {
    const scrollUpButton = document.querySelector('.scroll-up-button');
    const scrollDownButton = document.querySelector('.scroll-down-button');
    const characterList = document.querySelector('.character-list');

    if (scrollUpButton && scrollDownButton && characterList) {
        scrollUpButton.style.display = 'flex';
        scrollDownButton.style.display = 'flex';

        scrollUpButton.addEventListener('click', function() {
            characterList.scrollTo({ top: 0, behavior: 'smooth' });
        });

        scrollDownButton.addEventListener('click', function() {
            characterList.scrollTo({ top: characterList.scrollHeight, behavior: 'smooth' });
        });
    }
});

document.addEventListener("click", function(event) {
    const isCard = event.target.closest(".character-card");
    const isDesc = event.target.closest(".character-description-below");

    if (!isCard && !isDesc) {
        const oldDesc = document.querySelector('.character-description-below');
        if (oldDesc) oldDesc.remove();

        d3.selectAll(".character-card").classed("selected", false);

        if (selectedNode) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
        }
    }
});

function highlightRelationships(type) {
    resetNodeStates();
    
    link.classed("highlighted", d => d.type == type)
        .classed("faded", d => d.type != type);

    const connectedNodes = new Set();
    links.forEach(link => {
        if (link.type == type) {
            connectedNodes.add(link.source.id);
            connectedNodes.add(link.target.id);
        }
    });

    node.classed("highlighted", d => connectedNodes.has(d.id))
        .classed("faded", d => !connectedNodes.has(d.id));

    labelGroups.classed("visible", d => connectedNodes.has(d.id));
}

// Six Degrees of Separation Tool (optimized)
document.addEventListener("DOMContentLoaded", function() {
    // ... [Keep the same Six Degrees tool code, but add throttling to search inputs]
    // Add this to the search input event listeners in the tool:
    let searchDebounce;
    sixDegreesTool.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('input', function(e) {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                // Original search logic here
            }, 100);
        });
    });
});

// Add window resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (simulation) {
            simulation.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
            simulation.alpha(0.3).restart();
        }
    }, 250);
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (simulation) {
        simulation.stop();
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
[file content end]
