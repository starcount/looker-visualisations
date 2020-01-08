numbro.registerLanguage({
  languageTag: "en-GB",
  delimiters: {
    thousands: ",",
    decimal: "."
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "b",
    trillion: "t"
  },
  ordinal: number => {
    let b = number % 10;
    return ~~((number % 100) / 10) === 1
      ? "th"
      : b === 1
      ? "st"
      : b === 2
      ? "nd"
      : b === 3
      ? "rd"
      : "th";
  },
  currency: {
    symbol: "£",
    position: "prefix",
    code: "GBP"
  },
  currencyFormat: {
    thousandSeparated: true,
    totalLength: 4,
    spaceSeparated: true,
    average: true
  },
  formats: {
    fourDigits: {
      totalLength: 4,
      spaceSeparated: true,
      average: true
    },
    fullWithTwoDecimals: {
      output: "currency",
      thousandSeparated: true,
      spaceSeparated: true,
      mantissa: 2
    },
    fullWithTwoDecimalsNoCurrency: {
      mantissa: 2,
      thousandSeparated: true
    },
    fullWithNoDecimals: {
      output: "currency",
      thousandSeparated: true,
      spaceSeparated: true,
      mantissa: 0
    }
  }
});

numbro.setLanguage("en-GB");

const createTable = (title, current, percentage, contribution) => {
  const positive = contribution > 0;
  const negative = contribution < 0;

  return `<table width="200" class="${positive ? "result-positive" : ""} ${
    negative ? "result-negative" : ""
  }">
    <tr>
      <th colspan="2">${title}</th>
    </tr>
    <tr>
      <td>Current</td>
      <td class="value">${numbro(current).formatCurrency()}</td>
    </tr>
    <tr class="percentage">
      <td>%</td>
      <td class="value">${percentage}</td>
    </tr>
    <tr class="contribution">
      <td>Contribution</td>
      <td class="value">${numbro(contribution).formatCurrency()}</td>
    </tr>
  </table>`;
};

looker.plugins.visualizations.add({
  create: function(element, config) {
    element.innerHTML = `
    <style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

    .Treant { position: relative; overflow: hidden; padding: 0 !important; }
    .Treant .node,
    .Treant .pseudo { position: absolute; display: block; visibility: hidden; 
      background-color: #FFFFFF; }
    .Treant.Treant-loaded .node,
    .Treant.Treant-loaded .pseudo { visibility: visible; }
    .Treant > .pseudo { width: 0; height: 0; border: none; padding: 0; }
    .Treant .collapse-switch { width: 3px; height: 3px; display: block; border: 1px solid black; position: absolute; top: 1px; right: 1px; cursor: pointer; }
    .Treant .collapsed .collapse-switch { background-color: #868DEE; }
      #OrganiseChart-simple { height: 100%; width: 100%; margin: 5px; margin: 5px auto; }
      .node { color: #9CB5ED; border: 1px solid #898C8F; border-radius: 6px; width: 240px; transition: box-shadow 0.2s linear; }
      .node p { font-size: 20px; line-height: 20px; height: 20px; font-weight: bold; padding: 3px; margin: 0; }

      .node:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
      }

      .result-positive .percentage .value, .result-positive .contribution .value, .result-positive th {
        color: #2ECC40;
      }
      
      .result-negative .percentage .value, .result-negative .contribution .value, .result-negative th {
        color: #FF4136;
      }

      th {
        text-transform: uppercase;
        font-family: "Open Sans";
      }

      th, td {
        padding: 4px 8px;
      }

      table {
        color: #636666;
        width: 100%;
        border-collapse: collapse;
        border-style: hidden;
      }

      .td {
        font-family: Arial;
      }

      .value {
        font-family: Helvetica;
        text-align: center;
      }
      
      th, td {
        border: 1px solid #898C8F;
      }
    </style>
  `;

    const chartConfig = {
      chart: {
        container: "#OrganiseChart-simple",
        subTeeSeparation: 50,
        siblingSeparation: 50,
        levelSeparation: 100,
        connectors: {
          type: "step",
          style: {
            "arrow-end": "classic-wide-long",
            "stroke-width": 2,
            stroke: "#898C8F"
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
                innerHTML: createTable("customers", 1810000, 90, 20)
              },
              {
                innerHTML: createTable("spend per customer", 181, 90, 20),
                children: [
                  {
                    innerHTML: createTable("baskets per customer", 181, 90, 20)
                  },
                  {
                    innerHTML: createTable("spend per basket", -181, 90, 20),
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
                innerHTML: createTable("spend per basket", 181, 90, -20),
                children: [
                  {
                    innerHTML: createTable("units per basket", 181, 90, 20)
                  },
                  {
                    innerHTML: createTable("spend per unit", 181, 90, -20)
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

      const scaleContainer = document.createElement("div");

      const parentWidth = container.getBoundingClientRect().width;
      const contentWidth = container.childNodes[0].getBoundingClientRect()
        .width;

      scaleContainer.append(...container.childNodes);
      container.append(scaleContainer);

      const scale = parentWidth / contentWidth;

      scaleContainer.style.transform = `scale(${scale})`;
      scaleContainer.style.transformOrigin = "left top";
      scaleContainer.style.position = "relative";
    }, 1000);
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    console.log(data, element, config, queryResponse, details, done);
  }
});
