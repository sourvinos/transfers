import { Injectable } from '@angular/core'
import * as pdfMake from 'pdfmake/build/pdfmake.js'
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js'
import { TransferFlat } from './transfer-flat'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class TransferPdfService {

    createReport(transfers: any[], drivers: any[], date: string) {
        const array = this.sort(transfers)
        drivers.forEach(driver => {
            const filteredArray = array.filter(x => x.driver === driver)
            const dd = {
                pageMargins: [50, 40, 50, 50],
                pageOrientation: 'landscape',
                defaultStyle: { fontSize: 8 },
                header: this.createPageHeader(driver, date),
                footer: this.createPageFooter(),
                content: this.table(filteredArray, ['time', 'pickupPoint', 'adults', 'kids', 'free', 'totalPersons', 'customer', 'remarks', 'destination'], ['center', 'left', 'right', 'right', 'right', 'right', 'left', 'left', 'center'], driver)
            }
            this.createPdf(dd, driver)
        })
    }

    private table(data: any[], columns: any[], align: any[], driver: string) {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, align, driver),
                heights: 10,
                widths: [20, '*', 15, 15, 15, 15, 150, 180, 20],
            },
            layout: {
                hLineColor: function (i: number, node: { table: { widths: string | any[] } }) { return (i === 0 || i === node.table.widths.length) ? '#dddddd' : '#dddddd' },
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }) { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function () { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number) { return (i === 0) ? 5 : 5 },
                paddingBottom: function () { return 2 }
            }
        }
    }

    private buildTableBody(data: any[], columns: any[], align: any[], driver: string) {
        const body: any = []
        let pickupPointCount = 0
        let pickupPointPersons: number[] = [0, 0, 0, 0]
        let driverPersons: number[] = [0, 0, 0, 0]
        let pickupPointDescription = data[0].pickupPoint
        body.push(this.createTableHeaders())
        data.forEach(((row) => {
            let dataRow = []
            if (row.pickupPoint === pickupPointDescription) {
                const { pickupPointCount: x, total: z } = this.addPersonsToPickupPoint(pickupPointCount, pickupPointPersons, row)
                pickupPointCount = x
                pickupPointPersons = z
            } else {
                if (pickupPointCount > 1) {
                    body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
                    dataRow = []
                }
                pickupPointCount = 1
                pickupPointDescription = row.pickupPoint
                pickupPointPersons = this.initPickupPointPersons(pickupPointPersons, row)
            }
            driverPersons = this.addPersonsToDriver(driverPersons, row)
            dataRow = this.replaceZerosWithBlanks(columns, row, dataRow, align)
            body.push(dataRow)
        }))
        if (pickupPointCount > 1) {
            body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
        }
        body.push(this.createBlankLine())
        body.push(this.createTotalLineForDriver(driver, driverPersons))
        return body
    }

    private createTableHeaders() {
        return [
            { text: 'TIME', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'PICKUP POINT', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'A', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'K', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'F', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'T', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'CUSTOMER', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'REMARKS', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'D', style: 'tableHeader', alignment: 'center', bold: true },
        ]
    }

    private createPickupPointTotalLine(pickupPoint: string, total: any[]) {
        return [
            { text: '' },
            { text: 'TOTAL FROM ' + pickupPoint, bold: true },
            { text: String(total[0]) === '0' ? '' : String(total[0]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(total[1]) === '0' ? '' : String(total[1]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(total[2]) === '0' ? '' : String(total[2]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(total[3]) === '0' ? '' : String(total[3]), alignment: 'right', fillColor: 'white', bold: true },
            { text: '' },
            { text: '' },
            { text: '' }
        ]
    }

    private sort(array: TransferFlat[]) {
        const sortedArray = array.sort((a, b) => {
            if (a.driver > b.driver) { return 1 }
            if (a.driver > b.driver) { return 1 }
            if (a.time > b.time) { return 1 }
            if (a.time < b.time) { return -1 }
            if (a.pickupPoint > b.pickupPoint) { return 1 }
            if (a.pickupPoint < b.pickupPoint) { return -1 }
            if (a.customer > b.customer) { return 1 }
            if (a.customer < b.customer) { return -1 }
            if (a.destination > b.destination) { return 1 }
            if (a.destination < b.destination) { return -1 }
        })
        return sortedArray
    }

    private createPageHeader(driver: string, date: string) {
        return function () {
            return {
                table: {
                    widths: '*',
                    body: [[
                        { text: 'DRIVER: ' + driver, alignment: 'left', bold: true, margin: [50, 20, 50, 60] },
                        { text: 'DATE: ' + date, alignment: 'right', bold: true, margin: [50, 20, 50, 60] }
                    ]]
                },
                layout: 'noBorders'
            }
        }
    }

    private createPageFooter() {
        return function (currentPage: any, pageCount: any) {
            return {
                table: {
                    widths: '*',
                    body: [[{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: 'normalText', margin: [0, 10, 50, 0] }]]
                },
                layout: 'noBorders'
            }
        }
    }

    private addPersonsToDriver(totals: number[], row: { adults: any; kids: any; free: any; totalPersons: any }) {
        totals[0] += Number(row.adults)
        totals[1] += Number(row.kids)
        totals[2] += Number(row.free)
        totals[3] += Number(row.totalPersons)
        return totals
    }

    private replaceZerosWithBlanks(columns: any[], row: { [x: string]: { toString: () => any } }, dataRow: any[], align: any[]) {
        columns.forEach((element, index) => {
            if (row[element].toString() === '0') { row[element] = '' }
            dataRow.push({ text: row[element].toString(), alignment: align[index].toString(), color: '#000000', noWrap: false, })
        })
        return dataRow
    }

    private initPickupPointPersons(total: number[], row: any) {
        total[0] = Number(row.adults)
        total[1] = Number(row.kids)
        total[2] = Number(row.free)
        total[3] = Number(row.totalPersons)
        return total
    }

    private createTotalLineForDriver(driver: string, totals: any[]) {
        const dataRow = []
        dataRow.push(
            { text: '' },
            { text: 'TOTAL FOR ' + driver, bold: true },
            { text: String(totals[0]) === '0' ? '' : String(totals[0]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(totals[1]) === '0' ? '' : String(totals[1]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(totals[2]) === '0' ? '' : String(totals[2]), alignment: 'right', fillColor: 'white', bold: true },
            { text: String(totals[3]) === '0' ? '' : String(totals[3]), alignment: 'right', fillColor: 'white', bold: true },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
    }

    private addPersonsToPickupPoint(pickupPointCount: number, total: number[], row: { adults: any; kids: any; free: any; totalPersons: any }) {
        pickupPointCount += 1
        total[0] += Number(row.adults)
        total[1] += Number(row.kids)
        total[2] += Number(row.free)
        total[3] += Number(row.totalPersons)
        return { pickupPointCount, total }
    }

    private createBlankLine() {
        const dataRow = []
        dataRow.push(
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
    }

    private createPdf(document: any, driver: string) {
        pdfMake.createPdf(document).download(driver + '.pdf')
    }

}

