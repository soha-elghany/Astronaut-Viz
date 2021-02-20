async function franceNetworkChart() {

    var data = await d3.json("./france-test.json")
    console.log(data)

    var height = 30
    var width = 40

    var links = data.links.map(d => Object.create(d));
    var nodes = data.nodes.map(d => Object.create(d));

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(0.5))
        .force("charge", d3.forceManyBody())
        //.force('collision', d3.forceCollide().radius(0.1))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter());

    var svg = d3.select("#france")
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    var link = svg.append("g")
        .attr("stroke", "#ffe3d8")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 0.05);

    // var node = svg.append("g")
    //     .attr("id", "circleTooltip")
    //     .attr("stroke-opacity", 0.3);

    const node = svg.append("g")
        // .attr("stroke", "#a72461")
        // .attr("stroke-width", 0.1)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 0.5)
        .attr("fill", "#f2d974")
        .attr("fill-opacity", 0.4);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    var tooltipText = node.append("title")
        .text(d => d.id);

    console.log(nodes)


}
franceNetworkChart()


async function networkChart() {

    const data = await d3.json("./test.json")
    // console.log(data)

    const height = 700
    const width = 700

    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
  
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(10))
        .force("charge", d3.forceManyBody().strength(-20))
        //.force('collision', d3.forceCollide().radius(0.1))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter());
  
    const svg = d3.select("#svg")
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])

    const usa = nodes.filter(d => d.label == "UNITED STATES")
        console.log(usa)
    const russia = nodes.filter(d => d.label == "RUSSIA")
   
    const link = svg.append("g")
        .attr("stroke", "#c7956d")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 0.4)
        .attr("stroke-opacity", 0.3);

    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 1)
        .style("display", 'inline')
        .style("color", "#7C7C7E")
        .style("font-size","14px");

    const node = svg.append("g")
        // .attr("stroke", "#a72461")
        // .attr("stroke-width", 0.1)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 0.9)
        // .attr("fill", "#f2d974")
        .attr("fill", function(d){
            if (d.label == "UNITED STATES") {return "#8d93ab"}
            else if (d.label == "RUSSIA") {return "#f05454"}
            else {return "#f2d974"}; 
        })
        .attr("fill-opacity", 0.7)
        .on("mouseover", function(event, d){
            console.log(d);
            div.transition()
            .duration(200)
            .style("opacity", 1);
            div.html(d.id)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 5) + "px");

        })
        .on("mouseout", function(d){
          div.transition()
          .duration(500)
          .style("opacity", 0);
        });
        
    node.append("title")
        .text(d => d.id);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          
    });
    
  }
  networkChart()

async function drawLineChart() {

    // 1. Access data
    const dataset = await d3.json("./year.json")
  
    const yAccessor = d => d.values
    const dateParser = d3.timeParse("%m-%d-%Y")
    const xAccessor = d => dateParser(d.date)
  
    // 2. Create chart dimensions
  
    let dimensions = {
      width: window.innerWidth * 0.6,
      height: 250,
      margin: {
        top: 15,
        right: 20,
        bottom: 40,
        left: 30,
      },
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom
  
    // 3. Draw canvas
  
    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
  
    const bounds = wrapper.append("g")
        .style("transform", `translate(${
          dimensions.margin.left
        }px, ${
          dimensions.margin.top
        }px)`)
  
    // 4. Create scales
  
    const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight,0])

  
    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])
  
    // 5. Draw data
  
    const lineGenerator = d3.line()
      .curve(d3.curveCardinal)
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const line = bounds.append("path")
        .attr("d", lineGenerator(dataset))
        .attr("fill", "none")
        .attr("stroke", "#c7956d")
        .attr("stroke-width", 0.6)
        .attr("stroke-opacity", 0.8)
        .attr("fill-opacity", 0.9)
        
    // 6. Draw peripherals
  
    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
  
    const yAxis = bounds.append("g")
      .call(yAxisGenerator)
      .style("stroke", "#7C7C7E")
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.8)
      
      
    const xAxisGenerator = d3.axisBottom().tickSize(1)
      .scale(xScale)
  
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)
        .style("stroke", "#7C7C7E")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.8)
    
  }
  drawLineChart()
