function drawChart() {
	'use strict';
	var data = new google.visualization.DataTable(),
		desc = [],
		desc_title = [],
		td_array = [],
		titles = [],
		title = $("h1").text().replace("&amp;", "&"),
		count,
		text_colour = "#093440",
		font_stack = "'Source Sans Pro', sans-serif, Arial",
		title_font_stack = "'Open Sans', 'Source Sans Pro', sans-serif",
		bar_colour = "#248096",
		number_of_rows = $('table tbody tr').length,
		height = number_of_rows * 35 + 100,
		options = {
			title: title,
			titleTextStyle: {
				fontSize: 20,
				bold: true,
				color: text_colour,
				fontName: title_font_stack
			},
			vAxis: {
				textStyle: {
					fontSize: 18,
					fontName: font_stack,
					color: text_colour
				},
				textPosition: 'out'
			},
			hAxis: {
				title: 'Budget (\u00A3m)',
				titleTextStyle: {
					color: text_colour,
					fontName: font_stack,
					fontSize: 18
				},
				textStyle: {
					color: text_colour,
					fontName: font_stack,
					fontSize: 18
				}
			},
			chartArea: {
				left: 250,
				top: 50,
				height: number_of_rows * 35
			},
			colors: [bar_colour],
			height: height,
			legend: {
				position: "none"
			}
		},
		chart;

	// capitalise first letter of string
	String.prototype.capitalise = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	// add 'description' class to last th/td of each row
	$('table thead tr').each(function (i, tr) {
		$(tr).find('th').filter(":last").addClass("description");
	});

	$('table tbody tr').each(function (i, tr) {
		$(tr).find('td').filter(":last").addClass("description");
	});

	// add headers
	$('table thead tr th').not(".description").each(function (i) {
		if (i === 0) {
			data.addColumn('string', "link");
		} else {
			data.addColumn('number', $(this).text());
		}
	});

	// add rows
	$('table tbody tr').each(function (i, tr) {
		var tds = $(tr).find('td').not(".description");

		for (count = 0; count < tds.length; count += 1) {
			if (count === 0) {
				td_array[count] = tds.eq(count).text();
			} else {
				td_array[count] = parseFloat(tds.eq(count).text());
			}
		}
		data.addRow(td_array);

		desc[i] = $(tr).find('td.description').text();
		desc_title[i] = $(tr).find('td').eq(0).text();
	});

	// fires when any part of the chart is clicked, but only does something when a service title is clicked
	function clickHandler(e) {
		// if statement checks that one of the service titles (left navigation) were clicked
		if (e.targetID.substring(0, "vAxis#0#label#".length) === "vAxis#0#label#") {
			var target = e.targetID,
			row = e.targetID.replace("vAxis#0#label#", ""),
			service_title,
			link;
			row = parseInt(row, 10);
			// gets service title from table row
			if ($('table tbody tr').eq(row).find('td').eq(0).hasClass("link")) {
				service_title = $('table tbody tr').eq(row).find('td').eq(0).text();
				// replaces spaces with dashes
				service_title = service_title.toLowerCase().split(" ").join("-").replace("'", "").replace("#", "").replace("&", "and").replace(",", "");
				// builds link
				link = window.location.href.replace("/_nocache", "").replace("#", "") + "/" + service_title;
				window.location.href = link;
			}
		}
	}

	// fires when a bar is clicked
	function selectHandler(e) {
		var selection = chart.getSelection();
		$("#bc_description").html("<h5>" + desc_title[selection[0].row] + "</h5>");
		$("#bc_description").append("<p>" + desc[selection[0].row] + "</p>");
		chart.setSelection();
	}
	chart = new google.visualization.BarChart(document.getElementById('bc_visualization'));
	chart.draw(data, options);

	google.visualization.events.addListener(chart, 'select', selectHandler);
	google.visualization.events.addListener(chart, 'click', clickHandler);

	// add .link class to titles that have <a> tags
	$('table tbody tr').each(function (i, tr) {
		titles[i] = $(tr).find('td').not(".description").has("a").length;
		var url = window.location.href.replace("/_nocache", "").replace("#", "") + "/" + ($('table tbody tr').eq(i).find('td a').eq(0).text().toLowerCase().split(" ").join("-")).replace("'", "").replace("#", "").replace("&", "and").replace(",", "");
		if (titles[i] === 1) {
			$('table tbody tr').eq(i).find('td').eq(0).attr("class", "link");
			$('table tbody tr').eq(i).find('td a').eq(0).attr("href", url);
		}
	});

	// styles left-hand side service titles
	$('svg g g g text[text-anchor="end"]').each(function (i, el) {
		if (titles[i] === 1) {
			$(this).attr("class", "link");
			$(this).attr("fill", "#c8403e");
			$(this).css("cursor", "pointer");
			$(this).css("text-decoration", "underline");
		}
	});
}

$(document).ready(function () {
	'use strict';

	$('table').eq(0).addClass("bc_table");
	$('table').eq(0).addClass("show-for-small-only");
	$(".bc_table").attr("border", "0");
	google.load("visualization", "1", {packages: ["corechart"], "callback": drawChart});

	// view as table/graph button
	var table_view = false;
	$("#change_view").click(function () {
		if (!table_view) {
			$(".bc_table").removeClass("show-for-small-only").addClass("small-12").show();
			$("#bc_visualization").removeClass("show-for-medium-up").parent().hide();
			$("#bc_description").removeClass("show-for-medium-up");
			$(this).html("<p>View as graph</p>");
			table_view = true;
		} else {
			$(".bc_table").hide();
			$("#bc_visualization").css("display", "block").parent().show();
			drawChart();
			$(this).html("<p>View as table</p>");
			table_view = false;
		}
	});

	$(window).resize(function () {
		if ($("#bc_visualization").is(":visible")) {
			drawChart();
		}
	});
});