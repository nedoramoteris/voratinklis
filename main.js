// Optimized version with performance improvements

document.addEventListener("DOMContentLoaded", function () {
    // Dark mode toggle (unchanged - lightweight)
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
            document.querySelectorAll('.dark-mode-toggle, .hide-list-toggle, .scroll-up-button, .scroll-down-button')
                .forEach(button => {
                    button.style.left = "20px";
                });
        } else {
            characterList.style.display = "block";
            localStorage.setItem("listVisible", "true");
            listToggle.innerText = "☰";
            document.querySelectorAll('.dark-mode-toggle').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.hide-list-toggle').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.scroll-up-button').forEach(btn => btn.style.left = "268px");
            document.querySelectorAll('.scroll-down-button').forEach(btn => btn.style.left = "268px");
        }
    });
});

// Initialize all global variables
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

// Performance optimization: Pre-calculate these for faster access
let nodeMap = new Map();
let linkMap = new Map();
let adjacencyList = new Map();

// Race color mapping (unchanged)
const raceColors = {
    'hunter': '#94655D',
    'werewolf': '#434F3F',
    'hybrid': '#524047',
    'witch': '#405752',
    'human': '#4C4957',
    'vampire': '#944444',
    'volturi': '#664E64',
    'hunterwitch': '#94655D',
    'vampirehunter': '#7B403B',
    'vampirewitch': '#405752',
    'supernaturalhuman': '#756059',
    'hybridhunter': '#94655D',
    'pet': '#d4bc85'
};

// SVG setup
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Initialize zoom with throttling for better performance
const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .filter(event => !event.ctrlKey && !event.button) // Prevent zoom on right-click
    .on("zoom", zoomed);

const container = svg.append("g");

svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity.scale(0.2).translate(width/4, height/4));

function zoomed(event) {
    // Use requestAnimationFrame for smoother zooming
    requestAnimationFrame(() => {
        container.attr("transform", event.transform);
    });
}

// Optimized age calculation with caching
const ageCache = new Map();

function calculateAge(dob, dod) {
    const cacheKey = `${dob}|${dod}`;
    if (ageCache.has(cacheKey)) return ageCache.get(cacheKey);
    
    if (!dob || dob === '...') return '...';
    
    const bcMatch = dob.match(/(\d+)\s*BC/i);
    if (bcMatch) {
        const bcYear = parseInt(bcMatch[1]);
        const currentYear = new Date().getFullYear();
        const result = (currentYear + bcYear).toString();
        ageCache.set(cacheKey, result);
        return result;
    }
    
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const trimmed = dateStr.trim().toUpperCase();

        const bcMatch = trimmed.match(/^(\d+)\s*BC$/);
        if (bcMatch) return { year: -parseInt(bcMatch[1], 10) };

        const adMatch = trimmed.match(/^(\d+)\s*(AD)?$/);
        if (adMatch) return { year: parseInt(adMatch[1], 10) };

        const usDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
        if (usDate) return {
            year: parseInt(usDate[3], 10),
            month: parseInt(usDate[1], 10),
            day: parseInt(usDate[2], 10)
        };

        const isoDate = trimmed.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/);
        if (isoDate) return {
            year: parseInt(isoDate[1], 10),
            month: parseInt(isoDate[2], 10),
            day: parseInt(isoDate[3], 10)
        };

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
            const result = age.toString();
            ageCache.set(cacheKey, result);
            return result;
        } else if (birthInfo.year && deathInfo.year) {
            const result = (deathInfo.year - birthInfo.year).toString();
            ageCache.set(cacheKey, result);
            return result;
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
        const result = age.toString();
        ageCache.set(cacheKey, result);
        return result;
    } else if (birthInfo.year) {
        const result = (currentYear - birthInfo.year).toString();
        ageCache.set(cacheKey, result);
        return result;
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

    // Build node map for O(1) lookups
    nodeMap.clear();
    nodes.forEach(node => nodeMap.set(node.id, node));

    // Process links
    const linksLines = linksText.split('\n').filter(line => line.trim());
    links = linksLines.map(line => {
        const [source, target, relationship, type] = line.split('\t');
        return { 
            source: nodeMap.get(source), 
            target: nodeMap.get(target), 
            relationship, 
            type 
        };
    }).filter(link => link.source && link.target);

    // Build adjacency list for faster path finding
    buildAdjacencyList();

    // Optimized simulation settings
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(400).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-800).distanceMin(100))
        .force("collision", d3.forceCollide().radius(100).strength(0.1))
        .alphaDecay(0.02)
        .velocityDecay(0.4); // Add velocity decay for smoother movement

    drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
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
    
    createVisualization();
}

// Build adjacency list for faster path finding
function buildAdjacencyList() {
    adjacencyList.clear();
    nodes.forEach(node => adjacencyList.set(node.id, []));
    
    links.forEach(link => {
        adjacencyList.get(link.source.id).push({ 
            node: link.target.id, 
            relationship: link.relationship,
            type: link.type
        });
        adjacencyList.get(link.target.id).push({ 
            node: link.source.id, 
            relationship: link.relationship,
            type: link.type
        });
    });
}

// Optimized visualization creation
function createVisualization() {
    const defs = svg.append("defs");
    
    // Create gradients (unchanged)
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
        .style("fill", d => raceColors[d.race] || "#292725")
        .style("pointer-events", "none"); // Improve performance by ignoring pointer events

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
    const nodeGroup = container.append("g")
        .attr("class", "nodes");

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
                applyFilters();
            } else {
                selectedNode = d;
                highlightNodeAndConnections(d);
                centerOnNode(d);
                hideTooltip();

                d3.selectAll(".character-card").classed("selected", card => card.name === d.name);

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
        })
        .on("mouseover", function(event, d) {
            if (!selectedNode) {
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
                
                d3.select(this).select(".node-label")
                    .style("font-weight", "bold")
                    .style("font-size", "1.2em");
                
                showTooltip(d, event);
            }
        })
        .on("mouseout", function(event, d) {
            if (!selectedNode) {
                resetNodeStates();
                d3.select(this).select(".node-label")
                    .style("font-weight", "normal")
                    .style("font-size", "1em");
                
                hideTooltip();
            }
        });

    // Add images to nodes with lazy loading
    node.append("image")
        .attr("xlink:href", d => d.image)
        .attr("width", 160)
        .attr("height", 160)
        .attr("x", -80)
        .attr("y", -80)
        .attr("class", "node-image")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", (d, i) => `url(#circle-clip-${i})`)
        .attr("loading", "lazy");

    // Add clip paths
    node.append("clipPath")
        .attr("id", (d, i) => `circle-clip-${i}`)
        .append("circle")
        .attr("r", 80);

    // Add border circles
    node.append("circle")
        .attr("r", 80)
        .attr("class", "node-circle")
        .style("stroke", "#292725")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("pointer-events", "none"); // Improve performance

    // Add drag behavior
    node.call(drag);

    svg.on("click", function () {
        if (selectedNode) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
            applyFilters();
            d3.selectAll(".character-card").classed("selected", false);
        }
    });

    // Optimized tick handler with throttling
    let ticking = false;
    simulation.on("tick", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updatePositions();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Separate function for position updates
function updatePositions() {
    const linkGroups = {};
    links.forEach(link => {
        const key = [link.source.id, link.target.id].sort().join('-');
        if (!linkGroups[key]) {
            linkGroups[key] = [];
        }
        linkGroups[key].push(link);
    });

    link.each(function(d) {
        const key = [d.source.id, d.target.id].sort().join('-');
        const group = linkGroups[key];
        const index = group.indexOf(d);
        const total = group.length;
        
        const offset = (index - (total - 1) / 2) * 10;
        
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

    node.attr("transform", d => `translate(${d.x},${d.y})`);
    labelGroups.attr("transform", d => `translate(${d.x},${d.y + 80})`);
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
    const connectedNodes = new Set([d.id]);
    links.forEach(link => {
        if (link.source.id === d.id) connectedNodes.add(link.target.id);
        if (link.target.id === d.id) connectedNodes.add(link.source.id);
    });

    resetNodeStates();
    
    node.classed("selected", n => n === d)
        .classed("highlighted", n => connectedNodes.has(n.id))
        .classed("faded", n => !connectedNodes.has(n.id) && n !== d);
    
    link.classed("highlighted", l => l.source.id === d.id || l.target.id === d.id)
        .classed("faded", l => l.source.id !== d.id && l.target.id !== d.id);
    
    labelGroups.classed("visible", n => connectedNodes.has(n.id));
    
    if (d) {
        labelGroups.filter(n => n.id === d.id).select(".node-label")
            .style("font-weight", "bold")
            .style("font-size", "1.2em");
    }
}

// Optimized tooltip with debouncing
let tooltipTimeout;
function showTooltip(d, event) {
    clearTimeout(tooltipTimeout);
    const tooltip = d3.select("#node-tooltip");
    if (tooltip.empty()) {
        d3.select("body").append("div")
            .attr("id", "node-tooltip")
            .attr("class", "node-tooltip");
    }
    
    let tooltipContent = `<div class="tooltip-header">${d.name}</div>`;
    
    if (d.race && d.race !== '...') {
        tooltipContent += `<div class="tooltip-row"><i>${d.race}</i></div>`;
    }
    
    if (d.dob && d.dob !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Born:</strong> ${d.dob}</div>`;
    }
    
    if (d.dod && d.dod !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Died:</strong> ${d.dod}</div>`;
    }
    
    if (d.age && d.age !== '...') {
        tooltipContent += `<div class="tooltip-row"><strong>Age:</strong> ${d.age}</div>`;
    }
    
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
    tooltipTimeout = setTimeout(() => {
        d3.select("#node-tooltip")
            .style("opacity", 0);
    }, 100);
}

// Load and process data from GitHub
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

    // Process friendships data
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

// Function to populate the institution filter
function populateInstitutionFilter() {
    const institutionFilter = d3.select("#institution-filter");
    institutionFilter.selectAll("option:not(:first-child)").remove();
    
    Array.from(institutionsList).sort().forEach(institution => {
        institutionFilter.append("option")
            .attr("value", institution)
            .text(institution);
    });
    
    institutionFilter.on("change", applyFilters);
}

// Function to populate the friendship filter
function populateFriendshipFilter() {
    const friendshipFilter = d3.select("#friendship-filter");
    friendshipFilter.selectAll("option:not(:first-child)").remove();
    
    Array.from(friendshipsList).sort().forEach(friendship => {
        friendshipFilter.append("option")
            .attr("value", friendship)
            .text(friendship);
    });
    
    friendshipFilter.on("change", applyFilters);
}

// Function to set up the clear filters button
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

// Function to apply all filters
function applyFilters() {
    const selectedRace = d3.select("#race-filter").node().value;
    const selectedInstitution = d3.select("#institution-filter").node().value;
    const selectedFriendship = d3.select("#friendship-filter").node().value;
    
    d3.select("#characters-container").selectAll(".character-card")
        .style("display", d => {
            const raceMatch = selectedRace === "all" || d.race === selectedRace;
            const institutionMatch = selectedInstitution === "all" || 
                (institutionsData[d.name] && 
                 institutionsData[d.name].includes(selectedInstitution));
            const friendshipMatch = selectedFriendship === "all" || 
                (friendshipsData[d.name] && 
                 friendshipsData[d.name].includes(selectedFriendship));
            
            return raceMatch && institutionMatch && friendshipMatch ? "flex" : "none";
        });
}

// Function to populate the character list
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
        .attr("alt", d => d.name)
        .attr("loading", "lazy");
    
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
                .attr("loading", "lazy")
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
    
    d3.select("#race-filter").on("change", applyFilters);
}

// Debounced search function
let searchTimeout;
function searchCharacters(query) {
    clearTimeout(searchTimeout);
    
    if (!query) {
        d3.selectAll(".character-card").style("display", "flex");
        return;
    }

    searchTimeout = setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        
        const matches = nodes.filter(node => 
            node.name.toLowerCase().includes(lowerQuery) ||
            (node.race && node.race.toLowerCase().includes(lowerQuery)) ||
            (node.personality && node.personality.toLowerCase().includes(lowerQuery)) ||
            (institutionsData[node.name] && 
             institutionsData[node.name].some(i => i.toLowerCase().includes(lowerQuery))) ||
            (friendshipsData[node.name] && 
             friendshipsData[node.name].some(f => f.toLowerCase().includes(lowerQuery)))
        );

        d3.selectAll(".character-card")
            .style("display", d => 
                matches.some(match => match.id === d.id) ? "flex" : "none"
            );

        if (matches.length === 1) {
            selectNode(matches[0]);
        }
    }, 200); // Debounce for 200ms
}

function selectNode(node) {
    highlightNodeAndConnections(node);
    
    const container = document.getElementById('characters-container');
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
        .duration(800)
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
        
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        searchInput.dispatchEvent(event);
        
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
            searchCharacters('');
            if (selectedNode) {
                selectedNode = null;
                resetNodeStates();
                hideTooltip();
            }
        }
    });
});

// Add scroll functionality
document.addEventListener("DOMContentLoaded", function() {
    const scrollUpButton = document.querySelector('.scroll-up-button');
    const scrollDownButton = document.querySelector('.scroll-down-button');
    const characterList = document.querySelector('.character-list');

    if (scrollUpButton && scrollDownButton && characterList) {
        scrollUpButton.style.display = 'flex';
        scrollDownButton.style.display = 'flex';

        scrollUpButton.addEventListener('click', function() {
            characterList.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

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

        d3.selectAll(".character-card").classed("selected", false);

        if (selectedNode) {
            selectedNode = null;
            resetNodeStates();
            hideTooltip();
        }
    }
});

// Function to highlight relationships by type
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

// Make the relationship circles clickable
document.querySelectorAll('.relationship-circle').forEach(circle => {
    circle.addEventListener('click', function(event) {
        event.stopPropagation();
        
        const type = parseInt(this.getAttribute('data-type'));
        
        document.querySelectorAll('.relationship-circle').forEach(c => {
            c.classList.remove('active');
        });
        
        this.classList.add('active');
        
        highlightRelationships(type);
    });
});

// Click anywhere else to reset
document.addEventListener('click', function(event) {
    if (!event.target.closest('.relationship-circle') &&
        !event.target.closest('.legend-item') &&
        !event.target.closest('.node') &&
        !event.target.closest('.character-card')) {
        
        resetNodeStates();
        document.querySelectorAll('.relationship-circle').forEach(c => {
            c.classList.remove('active');
        });
    }
});

// Six Degrees of Separation Tool
document.addEventListener("DOMContentLoaded", function() {
    const sixDegreesTool = document.createElement('div');
    sixDegreesTool.id = 'six-degrees-tool';
    sixDegreesTool.className = 'six-degrees-tool';
    sixDegreesTool.innerHTML = `
        <div class="six-degrees-header">
            <span>Degrees of Separation</span>
            <button class="close-tool">×</button>
        </div>
        <div class="six-degrees-body">
            <div class="input-container">
                <div class="input-group">
                    <label>From:</label>
                    <div class="search-wrapper">
                        <input type="text" class="search-input from-input" placeholder="Select character">
                        <button class="clear-input clear-from">×</button>
                    </div>
                    <div class="search-results from-results"></div>
                </div>
                <div class="input-group">
                    <label>To:</label>
                    <div class="search-wrapper">
                        <input type="text" class="search-input to-input" placeholder="Select character">
                        <button class="clear-input clear-to">×</button>
                    </div>
                    <div class="search-results to-results"></div>
                </div>
            </div>
            <button class="find-path-button">Find Path</button>
            <div class="path-results"></div>
        </div>
    `;
    document.body.appendChild(sixDegreesTool);

    const sixDegreesButton = document.createElement('button');
    sixDegreesButton.id = 'six-degrees-button';
    sixDegreesButton.className = 'six-degrees-button';
    sixDegreesButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1">
    <path d="M886.51776 799.66208l-139.93984-139.93984c-10.50624-10.50624-23.90016-16.13824-37.60128-17.44896 42.16832-52.59264 67.54304-119.1936 67.54304-191.6928 0-169.39008-137.80992-307.2-307.2-307.2s-307.2 137.80992-307.2 307.2 137.80992 307.2 307.2 307.2c63.91808 0 123.31008-19.6608 172.52352-53.18656 0.34816 15.23712 6.22592 30.37184 17.85856 42.00448l139.93984 139.93984c11.9808 12.00128 27.72992 18.00192 43.43808 18.00192s31.45728-6.00064 43.43808-18.00192C910.52032 862.55616 910.52032 823.66464 886.51776 799.66208zM469.31968 655.38048c-112.92672 0-204.8-91.87328-204.8-204.8s91.87328-204.8 204.8-204.8 204.8 91.87328 204.8 204.8S582.2464 655.38048 469.31968 655.38048z"/>
  </svg>
`;
    document.body.appendChild(sixDegreesButton);

    let fromNode = null;
    let toNode = null;

    sixDegreesButton.addEventListener('click', function() {
        sixDegreesTool.style.display = sixDegreesTool.style.display === 'block' ? 'none' : 'block';
    });

    sixDegreesTool.querySelector('.close-tool').addEventListener('click', function() {
        sixDegreesTool.style.display = 'none';
    });

    sixDegreesTool.querySelectorAll('.clear-input').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.search-input');
            input.value = '';
            input.dispatchEvent(new Event('input'));
            if (this.classList.contains('clear-from')) {
                fromNode = null;
            } else {
                toNode = null;
            }
            resetPathHighlight();
        });
    });

    // Debounced search for "From" field
    let fromSearchTimeout;
    sixDegreesTool.querySelector('.from-input').addEventListener('input', function(e) {
        clearTimeout(fromSearchTimeout);
        const query = e.target.value.toLowerCase();
        const resultsContainer = sixDegreesTool.querySelector('.from-results');
        
        if (!query) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }
        
        fromSearchTimeout = setTimeout(() => {
            const matches = nodes.filter(node => 
                node.name.toLowerCase().includes(query)
            ).slice(0, 10);
            
            if (matches.length > 0) {
                resultsContainer.innerHTML = matches.map(node => 
                    `<div class="search-result-item" data-id="${node.id}">${node.name}</div>`
                ).join('');
                resultsContainer.style.display = 'block';
            } else {
                resultsContainer.innerHTML = '<div class="no-results">No matches found</div>';
                resultsContainer.style.display = 'block';
            }
        }, 200);
    });

    // Debounced search for "To" field
    let toSearchTimeout;
    sixDegreesTool.querySelector('.to-input').addEventListener('input', function(e) {
        clearTimeout(toSearchTimeout);
        const query = e.target.value.toLowerCase();
        const resultsContainer = sixDegreesTool.querySelector('.to-results');
        
        if (!query) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }
        
        toSearchTimeout = setTimeout(() => {
            const matches = nodes.filter(node => 
                node.name.toLowerCase().includes(query)
            ).slice(0, 10);
            
            if (matches.length > 0) {
                resultsContainer.innerHTML = matches.map(node => 
                    `<div class="search-result-item" data-id="${node.id}">${node.name}</div>`
                ).join('');
                resultsContainer.style.display = 'block';
            } else {
                resultsContainer.innerHTML = '<div class="no-results">No matches found</div>';
                resultsContainer.style.display = 'block';
            }
        }, 200);
    });

    sixDegreesTool.querySelectorAll('.search-results').forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.classList.contains('search-result-item')) {
                const nodeId = e.target.getAttribute('data-id');
                const node = nodes.find(n => n.id === nodeId);
                const isFrom = this.classList.contains('from-results');
                
                if (isFrom) {
                    fromNode = node;
                    sixDegreesTool.querySelector('.from-input').value = node.name;
                } else {
                    toNode = node;
                    sixDegreesTool.querySelector('.to-input').value = node.name;
                }
                
                this.style.display = 'none';
                
                resetNodeStates();
                node.classed("highlighted", n => n.id === (isFrom ? fromNode.id : toNode.id));
                centerOnNode(node);
            }
        });
    });

    sixDegreesTool.querySelector('.find-path-button').addEventListener('click', function() {
        if (!fromNode || !toNode) {
            alert('Please select both characters');
            return;
        }
        
        if (fromNode.id === toNode.id) {
            alert('Please select two different characters');
            return;
        }
        
        const path = findShortestPath(fromNode, toNode);
        displayPathResults(path);
        highlightPath(path);
    });

    // Use adjacency list for faster path finding
    function findShortestPath(startNode, endNode) {
        if (!adjacencyList.size) buildAdjacencyList();
        
        const queue = [[startNode.id]];
        const visited = new Set();
        visited.add(startNode.id);
        
        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];
            
            if (node === endNode.id) {
                const fullPath = [];
                for (let i = 0; i < path.length - 1; i++) {
                    const current = path[i];
                    const next = path[i + 1];
                    const link = adjacencyList.get(current).find(conn => conn.node === next);
                    fullPath.push({
                        from: current,
                        to: next,
                        relationship: link.relationship,
                        type: link.type
                    });
                }
                return fullPath;
            }
            
            adjacencyList.get(node).forEach(neighbor => {
                if (!visited.has(neighbor.node)) {
                    visited.add(neighbor.node);
                    const newPath = [...path, neighbor.node];
                    queue.push(newPath);
                }
            });
        }
        
        return null;
    }

    function displayPathResults(path) {
        const resultsContainer = sixDegreesTool.querySelector('.path-results');
        
        if (!path) {
            resultsContainer.innerHTML = '<div class="no-path">No connection found between these characters</div>';
            return;
        }
        
        let html = '<div class="path-header">Connection found:</div>';
        html += `<div class="path-step"><span class="path-name">${fromNode.name}</span></div>`;
        
        path.forEach((step, index) => {
            const node = nodes.find(n => n.id === step.to);
            const relationshipType = getRelationshipTypeName(step.type);
            html += `
                <div class="path-relationship">
                    <span class="relationship-type">${relationshipType}</span>
                    ${step.relationship ? `<span class="relationship-detail">(${step.relationship})</span>` : ''}
                </div>
                <div class="path-step">
                    <span class="path-name">${node.name}</span>
                </div>
            `;
        });
        
        html += `<div class="path-stats">Degrees of separation: ${path.length}</div>`;
        resultsContainer.innerHTML = html;
    }

    function highlightPath(path) {
        if (!path) return;
        
        resetNodeStates();
        
        const nodeIds = new Set();
        nodeIds.add(fromNode.id);
        nodeIds.add(toNode.id);
        path.forEach(step => nodeIds.add(step.to));
        
        node.classed("highlighted", n => nodeIds.has(n.id))
            .classed("faded", n => !nodeIds.has(n.id));
        
        link.classed("highlighted", l => {
            return path.some(step => 
                (step.from === l.source.id && step.to === l.target.id) ||
                (step.from === l.target.id && step.to === l.source.id)
            );
        }).classed("faded", l => {
            return !path.some(step => 
                (step.from === l.source.id && step.to === l.target.id) ||
                (step.from === l.target.id && step.to === l.source.id)
            );
        });
        
        const pathNodes = nodes.filter(n => nodeIds.has(n.id));
        
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        pathNodes.forEach(node => {
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
            .duration(800)
            .call(zoom.transform, d3.zoomIdentity
                .translate(x, y)
                .scale(scale));
    }

    function resetPathHighlight() {
        resetNodeStates();
        sixDegreesTool.querySelector('.path-results').innerHTML = '';
    }

    function getRelationshipTypeName(type) {
        const typeNames = {
            '0': "It's complicated",
            '1': "Friends",
            '2': "Family",
            '3': "Romantic partners",
            '4': "Frenemies",
            '5': "Friends with benefits",
            '6': "One night stand",
            '7': "Enemies",
            '8': "Colleagues"
        };
        return typeNames[type] || "knows";
    }
});
