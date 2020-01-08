const createTable = (title, current, percentage, contribution) =>
  `<table width="200">
    <tr>
      <th colspan="2">${title}</th>
    </tr>
    <tr>
      <td>Current</td>
      <td class="value">${current}</td>
    </tr>
    <tr>
      <td>%</td>
      <td class="value">${percentage}</td>
    </tr>
    <tr>
      <td>Contribution</td>
      <td class="value">${contribution}</td>
    </tr>
  </table>`;

looker.plugins.visualizations.add({
  create: function(element, config) {
    element.innerHTML = `
    <style>
    .Treant { position: relative; overflow: hidden; padding: 0 !important; }
    .Treant > .node,
    .Treant > .pseudo { position: absolute; display: block; visibility: hidden; }
    .Treant.Treant-loaded .node,
    .Treant.Treant-loaded .pseudo { visibility: visible; }
    .Treant > .pseudo { width: 0; height: 0; border: none; padding: 0; }
    .Treant .collapse-switch { width: 3px; height: 3px; display: block; border: 1px solid black; position: absolute; top: 1px; right: 1px; cursor: pointer; }
    .Treant .collapsed .collapse-switch { background-color: #868DEE; }
    .Treant > .node img {	border: none; float: left; }
      #OrganiseChart-simple { height: 100%; width: 100%; margin: 5px; margin: 5px auto; border: 3px solid #DDD; border-radius: 3px; }
      .node { color: #9CB5ED; border: 2px solid #C8C8C8; border-radius: 3px; }
      .node p { font-size: 20px; line-height: 20px; height: 20px; font-weight: bold; padding: 3px; margin: 0; }

      th {
        text-transform: uppercase;
      }

      th, td {
        padding: 4px;
      }

      table {
        color: black;
        border-collapse: collapse;
      }

      .value {
        font-family: monospace;
        text-align: center;
      }
      
      table, th, td {
        border: 1px solid black;
      }
    </style>
  `;

    const chartConfig = {
      chart: {
        container: "#OrganiseChart-simple",
        connectors: {
          type: "step",
          style: {
            "arrow-end": "classic-wide-long",
            "stroke-width": 2,
            stroke: "#665B57"
          }
        }
      },
      nodeStructure: {
        innerHTML: createTable("all sales", 181, 90, 20),
        children: [
          {
            innerHTML: createTable("sparks sales", 181, 90, 20),
            children: [
              {
                innerHTML: createTable("customers", 181, 90, 20)
              },
              {
                innerHTML: createTable("spend per customer", 181, 90, 20),
                children: [
                  {
                    innerHTML: createTable("baskets per customer", 181, 90, 20)
                  },
                  {
                    innerHTML: createTable("spend per basket", 181, 90, 20),
                    children: [
                      {
                        innerHTML: createTable("units per basket", 181, 90, 20)
                      },
                      {
                        innerHTML: createTable("spend per unit", 181, 90, 20)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            innerHTML: createTable("non-sparks sales", 181, 90, 20),
            children: [
              {
                innerHTML: createTable("baskets", 181, 90, 20)
              },
              {
                innerHTML: createTable("spend per basket", 181, 90, 20),
                children: [
                  {
                    innerHTML: createTable("units per basket", 181, 90, 20)
                  },
                  {
                    innerHTML: createTable("spend per unit", 181, 90, 20)
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    const container = element.appendChild(document.createElement("div"));
    container.id = "OrganiseChart-simple";

    setTimeout(() => {
      new Treant(chartConfig);
    }, 1000);
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    console.log(data, element, config, queryResponse, details, done);
  }
});
