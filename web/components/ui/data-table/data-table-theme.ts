import { themeQuartz } from "ag-grid-community";

export const theme = themeQuartz
    .withParams({
        wrapperBorder: { width: 2 },
        rowBorder: { width: 2 },
        headerRowBorder: { width: 2 },
        rowVerticalPaddingScale: 2,
        borderColor: "rgb(224, 231, 255)",
        rowHoverColor: "rgba(238, 242, 255, 0.5)",
        headerCellHoverBackgroundColor: "rgb(238, 242, 255)",
        headerBackgroundColor: "rgb(255, 255, 255)",
        headerTextColor: "rgba(49, 46, 129, 0.7)",
        checkboxCheckedBackgroundColor: "rgb(255, 255, 255)",
        checkboxIndeterminateBackgroundColor: "rgb(255, 255, 255)",
        checkboxBorderWidth: 2,
        checkboxUncheckedBorderColor: "rgb(99, 102, 241)",
        checkboxIndeterminateBorderColor: "rgb(99, 102, 241)",
        checkboxIndeterminateShapeColor: "rgb(99, 102, 241)",
        checkboxCheckedBorderColor: "rgb(99, 102, 241)",
        checkboxCheckedShapeColor: "rgb(99, 102, 241)",
        selectedRowBackgroundColor: "rgba(224, 231, 255, 0.5)",
    }
    )
    .withParams({
        borderColor: "rgb(224, 231, 255)",
        rowHoverColor: "rgba(238, 242, 255, 0.5)",
        headerCellHoverBackgroundColor: "rgb(238, 242, 255)",
        headerBackgroundColor: "rgb(255, 255, 255)",
        headerTextColor: "rgba(49, 46, 129, 0.7)",
        selectedRowBackgroundColor: "rgb(238, 242, 255)",
    }, "light"
    )
    .withParams({
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        rowHoverColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "rgb(49, 46, 129)",
        headerBackgroundColor: "rgba(79, 70, 229, 0.1)",
        headerCellHoverBackgroundColor: "rgb(49, 46, 129)",
        headerTextColor: "rgb(199, 210, 254)",
        selectedRowBackgroundColor: "rgba(0, 0, 0, 0.1)",
    }, "dark"
    );