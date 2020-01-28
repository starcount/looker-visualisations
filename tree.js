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

const chartConfig = {
  container: "#OrganiseChart-simple",
  subTeeSeparation: 50,
  siblingSeparation: 50,
  levelSeparation: 100,
  padding: 40,
  connectors: {
    type: "step",
    style: {
      "arrow-end": "classic-wide-long",
      "stroke-width": 2,
      stroke: "#898C8F"
    }
  }
};

let nodes,
  prevWidth,
  scaleContainer,
  treeReady = false;

const renderEmptyTree = container => {
  return new Promise(resolve => {
    const nodes = {};

    const { width } = container.getBoundingClientRect();

    if (width === 0) {
      return new Promise(resolve => {
        // Graph is sometimes drawn too early when proper layout is not yet rendered. It causes incorrect sizes.
        // We need to wait until page layout is ready.

        setTimeout(() => renderEmptyTree(container).then(resolve), 100);
      });
    }

    const onAfterPositionNode = node => {
      nodes[node.nodeHTMLid] = node.nodeDOM;
    };

    const onTreeLoaded = () => {
      scaleContainer = document.createElement("div");

      scaleContainer.append(...container.childNodes);
      container.append(scaleContainer);

      scaleTree();

      treeReady = true;

      resolve(nodes);
    };

    const config = {
      chart: Object.assign({}, chartConfig, {
        callback: {
          onAfterPositionNode,
          onTreeLoaded
        }
      }),
      nodeStructure: {
        innerHTML: createTable("all sales", 0, 0, 0),
        HTMLid: "all-sales",
        children: [
          {
            innerHTML: createTable("sparks sales", 0, 0, 0),
            HTMLid: "sparks-sales",
            children: [
              {
                innerHTML: createTable("customers", 0, 0, 0),
                HTMLid: "customers"
              },
              {
                innerHTML: createTable("spend per customer", 0, 0, 0),
                HTMLid: "spend-per-customer",
                children: [
                  {
                    innerHTML: createTable("baskets per customer", 0, 0, 0),
                    HTMLid: "baskets-per-customer"
                  },
                  {
                    innerHTML: createTable("spend per basket", 0, 0, 0),
                    HTMLid: "spend-per-basket",
                    children: [
                      {
                        innerHTML: createTable("units per basket", 0, 0, 0),
                        HTMLid: "units-per-basket"
                      },
                      {
                        innerHTML: createTable("spend per unit", 0, 0, 0),
                        HTMLid: "spend-per-unit"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            innerHTML: createTable("non-sparks sales", 0, 0, 0),
            HTMLid: "non-sparks-sales",
            children: [
              {
                innerHTML: createTable("baskets", 0, 0, 0),
                HTMLid: "baskets"
              },
              {
                innerHTML: createTable("spend per basket", 0, 0, 0),
                HTMLid: "non-sparks-spend-per-basket",
                children: [
                  {
                    innerHTML: createTable("units per basket", 0, 0, 0),
                    HTMLid: "non-sparks-units-per-basket"
                  },
                  {
                    innerHTML: createTable("spend per unit", 0, 0, 0),
                    HTMLid: "non-sparks-spend-per-unit"
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    setTimeout(() => {
      new Treant(config);
    }, 100);
  });
};

const extractTreeData = data => {
  return {
    "all-sales": {
      label: "All sales",
      type: "money",
      current: data[0]["published_kpi.total_sales"].value,
      growth: data[0]["published_kpi.growth_total_sales"].value,
      contribution: data[0]["published_kpi.contribution_total_sales"].value
    },
    "sparks-sales": {
      label: "Sparks sales",
      type: "money",
      current: data[2]["published_kpi.total_sales"].value,
      growth: data[2]["published_kpi.growth_total_sales"].value,
      contribution: data[2]["published_kpi.contribution_total_sales"].value
    },
    "non-sparks-sales": {
      label: "Non-sparks sales",
      type: "money",
      current: data[1]["published_kpi.total_sales"].value,
      growth: data[1]["published_kpi.growth_total_sales"].value,
      contribution: data[1]["published_kpi.contribution_total_sales"].value
    },
    customers: {
      label: "Customers",
      type: "quantity",
      current: data[2]["published_kpi.distinct_customers"].value,
      growth: data[2]["published_kpi.growth_distinct_customers"].value,
      contribution:
        data[2]["published_kpi.contribution_distinct_customers"].value
    },
    "spend-per-customer": {
      label: "Spend per customer",
      type: "money",
      current: data[2]["published_kpi.spend_per_customer"].value,
      growth: data[2]["published_kpi.growth_spend_per_customer"].value,
      contribution:
        data[2]["published_kpi.contribution_spend_per_customer"].value
    },
    "baskets-per-customer": {
      label: "Baskets per customer",
      type: "quantity",
      current: data[2]["published_kpi.baskets_per_customer"].value,
      growth: data[2]["published_kpi.growth_baskets_per_customer"].value,
      contribution:
        data[2]["published_kpi.contribution_baskets_per_customer"].value
    },
    "spend-per-basket": {
      label: "Spend per basket",
      type: "money",
      current: data[2]["published_kpi.spend_per_basket"].value,
      growth: data[2]["published_kpi.growth_spend_per_basket"].value,
      contribution: data[2]["published_kpi.contribution_spend_per_basket"].value
    },
    "units-per-basket": {
      label: "Units per basket",
      type: "quantity",
      current: data[2]["published_kpi.items_per_basket"].value,
      growth: data[2]["published_kpi.growth_items_per_basket"].value,
      contribution: data[2]["published_kpi.contribution_items_per_basket"].value
    },
    "spend-per-unit": {
      label: "Spend per unit",
      type: "money",
      current: data[2]["published_kpi.spend_per_item"].value,
      growth: data[2]["published_kpi.growth_spend_per_item"].value,
      contribution: data[2]["published_kpi.contribution_spend_per_item"].value
    },
    baskets: {
      label: "Baskets",
      type: "quantity",
      current: data[1]["published_kpi.baskets_per_customer"].value,
      growth: data[1]["published_kpi.growth_baskets_per_customer"].value,
      contribution:
        data[1]["published_kpi.contribution_baskets_per_customer"].value
    },
    "non-sparks-spend-per-basket": {
      label: "Spend per basket",
      type: "money",
      current: data[1]["published_kpi.spend_per_basket"].value,
      growth: data[1]["published_kpi.growth_spend_per_basket"].value,
      contribution: data[1]["published_kpi.contribution_spend_per_basket"].value
    },
    "non-sparks-units-per-basket": {
      label: "Units per basket",
      type: "quantity",
      current: data[1]["published_kpi.items_per_basket"].value,
      growth: data[1]["published_kpi.growth_items_per_basket"].value,
      contribution: data[1]["published_kpi.contribution_items_per_basket"].value
    },
    "non-sparks-spend-per-unit": {
      label: "Spend per unit",
      type: "money",
      current: data[1]["published_kpi.spend_per_item"].value,
      growth: data[1]["published_kpi.growth_spend_per_item"].value,
      contribution: data[1]["published_kpi.contribution_spend_per_item"].value
    }
  };
};

const createTable = (
  title,
  current,
  percentage,
  contribution,
  type,
  parent
) => {
  const positive = contribution > 0;
  const negative = contribution < 0;

  if (parent) {
    parent.classList.toggle("result-positive", positive);
    parent.classList.toggle("result-negative", negative);
  }

  return `<table width="200" class="${positive ? "result-positive" : ""} ${
    negative ? "result-negative" : ""
  }">
    <tr>
      <th colspan="2">${title}</th>
    </tr>
    <tr>
      <td>Current</td>
      <td class="value">${
        type === "money"
          ? numbro(current).formatCurrency()
          : numbro(current).format({
              average: true,
              mantissa: 1
            })
      }</td>
    </tr>
    <tr class="percentage">
      <td>%</td>
      <td class="value">${numbro(percentage / 100).format({
        output: "percent",
        mantissa: 2,
        spaceSeparated: true
      })}</td>
    </tr>
    <tr class="contribution">
      <td>Contribution</td>
      <td class="value">${numbro(contribution).formatCurrency()}</td>
    </tr>
  </table>`;
};

const scaleTree = () => {
  const parentWidth = scaleContainer.parentNode.getBoundingClientRect().width;
  const contentWidth = parseInt(
    scaleContainer.childNodes[0].getAttribute("width"),
    10
  );
  const scale = parentWidth / contentWidth;
  scaleContainer.style.transform = `scale(${scale})`;
  scaleContainer.style.maxHeight = 0;
  scaleContainer.style.transformOrigin = "left top";
  scaleContainer.style.position = "relative";
};

looker.plugins.visualizations.add({
  create: function(element) {
    element.innerHTML = `
    <style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

    #vis {
      opacity: 0;
    }

    #vis.visible {
      opacity: 1;
    }

    .Treant { position: relative; padding: 0 !important; border: 2px solid #898C8F; border-radius: 10px; }
    .Treant .node,
    .Treant .pseudo { position: absolute; display: block; visibility: hidden; 
      background-color: #FFFFFF; }
    .Treant.Treant-loaded .node,
    .Treant.Treant-loaded .pseudo { visibility: visible; }
    .Treant > .pseudo { width: 0; height: 0; border: none; padding: 0; }
    .Treant .collapse-switch { width: 3px; height: 3px; display: block; border: 1px solid black; position: absolute; top: 1px; right: 1px; cursor: pointer; }
    .Treant .collapsed .collapse-switch { background-color: #868DEE; }
      #OrganiseChart-simple { height: 100%; width: 100%; margin: 5px; margin: 5px auto; }
      .node { color: #9CB5ED; width: 240px; border: 2px solid #898C8F; transition: box-shadow 0.2s linear; border-radius: 6px; }
      .node p { font-size: 20px; line-height: 20px; height: 20px; font-weight: bold; padding: 3px; margin: 0; }

      .node.result-positive {
        border: 2px solid #6d8a46;
      }

      .node.result-negative {
        border: 2px solid #db7d78ff;
      }

      .node:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
      }

      .result-positive .percentage .value, .result-positive .contribution .value {
        color: #6d8a46;
      }
      
      .result-negative .percentage .value, .result-negative .contribution .value {
        color: #db7d78ff;
      }


      .result-positive th {
        color: #FFF;
        background-color: #6d8a46;
      }

      .result-negative th {
        color: #FFF;
        background-color: #db7d78ff;
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

    const container = element.appendChild(document.createElement("div"));
    container.id = "OrganiseChart-simple";

    renderEmptyTree(container).then(newNodes => {
      nodes = newNodes;

      this.trigger("filter", [
        {
          field: "none",
          value: "none",
          run: true
        }
      ]);
    });
  },
  updateAsync: function(data, element, _config, queryResponse, details, done) {
    if (treeReady === false) {
      return;
    }

    element.classList.toggle("visible", true);

    const newWidth = element.getBoundingClientRect();

    if (newWidth !== prevWidth) {
      prevWidth = newWidth;

      scaleTree();
    }

    const treeData = extractTreeData(data);

    Object.entries(treeData).forEach(([id, values]) => {
      nodes[id].innerHTML = createTable(
        values.label,
        values.current,
        values.growth,
        values.contribution,
        values.type,
        nodes[id]
      );
    });
  }
});
