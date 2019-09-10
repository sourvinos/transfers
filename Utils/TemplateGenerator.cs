using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Transfers.Models;

namespace Transfers.Utils
{
    public static class TemplateGenerator
    {
        public static string GetHTMLString()
        {
            var customers = new List<Customer>();

            customers.Add(new Customer { Id = 1, Description = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ" });
            customers.Add(new Customer { Id = 2, Description = "what" });

            var sb = new StringBuilder();

            sb.Append(@"
                        <html>
                            <head>
                            <style>
                                h1 {
                                    font-family:'Tahoma'
                                }
                            </style>
                            </head>
                            <body>
                                <div class='header'><h1>Report Header</h1></div>
                                <table align='center'>
                                    <tr>
                                        <th>ID</th>
                                        <th>Description</th>
                                    </tr>");

            foreach (var emp in customers)
            {
                sb.AppendFormat(@"<tr><td>---</td><td>{0}</td><td></td><td></td></tr>", emp.Description);
            }

            sb.Append(@"</table></body></html>");
            return sb.ToString();
        }

    }

}