"use strict";
import React from "react";
import ReactDOM from "react-dom";
import "./style.scss";

let request, json;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            data: null
        }
        this.handleD3 = this.handleD3.bind(this);
    }
    handleD3() {
        let yMargin = 40,
            width = 800,
            height = 400,
            barWidth = width / 275;
        var tooltip = d3.select(".visHolder")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);
        var overlay = d3.select(".visHolder")
            .append("div")
            .attr("class", "overlay")
            .style("opacity", 0);
        var svgContainer = d3.select(".visHolder")
            .append("svg")
            .attr("width", width + 100)
            .attr("height", height + 60);
        svgContainer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -200)
            .attr("y", 80)
            .text("Gross Domestic Product");
        svgContainer.append("text")
            .attr("x", width / 2 + 120)
            .attr("y", height + 50)
            .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
            .attr("class", "info");
        var years = this.state.data.data.map((element) => {
            var quarter = "";
            var temp = element[0].substring(5, 7);
            switch(temp) {
                case "01":
                    quarter = "Q1";
                    break;
                case "04":
                    quarter = "Q2";
                    break;
                case "07":
                    quarter = "Q3";
                    break;
                case "10":
                    quarter = "Q4";
                    break;
                default:
                    break;
            }
            return element[0].substring(0, 4) + " " + quarter;
        });
        var yearsDate = this.state.data.data.map((elements) => {
            return new Date(elements[0]);
        });
        var xScale = d3.scaleTime().domain([d3.min(yearsDate), d3.max(yearsDate)]).range([0, width]);
        var xAxis = d3.axisBottom().scale(xScale);
        var xAxisGroup = svgContainer.append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(60, 400)");
        var GDP = this.state.data.data.map((elements) => {
            return elements[1]; 
        });
        var linearScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([0, height]);
        var scaledGDP = GDP.map((element) => {
            return linearScale(element);
        });
        var yScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([height, 0]);
        var yAxis = d3.axisLeft().scale(yScale);
        var yAxisGroup = svgContainer.append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", "translate(60, 0)");
        d3.select("svg").selectAll("rect")
            .data(scaledGDP)
            .enter()
            .append("rect")
            .attr("data-date", (d, i) => {
                return this.state.data.data[i][0];
            })
            .attr("data-gdp", (d, i) => {
                return this.state.data.data[i][1];
            })
            .attr("class", "bar")
            .attr("x", (d, i) => {
                return xScale(yearsDate[i]);
            })
            .attr("y", (d, i) => {
                return height - d;
            })
            .attr("width", barWidth)
            .attr("height", (d) => {
                return d;
            })
            .style("fill", "#33adff")
            .attr("transform", "translate(60, 0)")
            .on("mouseover", (d, i) => {
                overlay.transition()
                    .duration(0)
                    .style("height", d + "px")
                    .style("width", barWidth + "px")
                    .style("opacity", 0.9)
                    .style("left", (i * barWidth) + 0 + "px")
                    .style("top", height - d + "px")
                    .style("transform", "translateX(60px)");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(years[i] + "<br>" + "$" + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " Billion")//number.toFixed(n), changes a decimal to string with 'n' decimals
                    .style("left", (i * barWidth) + 30 + "px")
                    .style("top", height - 100 + "px")
                    .style("transform", "translateX(60px)");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                overlay.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
    }
    componentDidMount() {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
            .then(response => response.json())
            .then(result => {
                this.setState({
                    isLoaded: true,
                    data: result
                });
                this.handleD3();
                }, error => {
                this.setState({
                    isLoaded: true,
                    error
                });
            });
    }
    render() {
        return (
            <div className="container">
                <div id="title">United States GDP</div>
                <div className="visHolder"></div>
            </div>
        );
        
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);