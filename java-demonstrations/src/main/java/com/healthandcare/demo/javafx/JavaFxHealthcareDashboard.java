package com.healthandcare.demo.javafx;

import com.healthandcare.demo.database.SqliteDemoService;
import com.healthandcare.demo.models.DemoAppointment;
import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;

import java.util.List;

/**
 * Mandatory JavaFX Implementation for Health & Care Academic Rubric.
 * Demonstrates:
 * - Stage and Scene
 * - Layouts: VBox, HBox, GridPane, BorderPane
 * - Controls: Label, TextField, Button, ComboBox, TableView, TableColumn, Alert
 * - JavaFX Event Handlers (setOnAction)
 * - Dashboard KPI summary metrics + Live Appointment Scheduling Table
 */
public class JavaFxHealthcareDashboard extends Application {

    private final SqliteDemoService sqliteService = new SqliteDemoService();
    private final ObservableList<DemoAppointment> appointmentData = FXCollections.observableArrayList();

    private Label totalPatientsLabel;
    private Label totalApptsLabel;
    private TableView<DemoAppointment> tableView;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("HEALTH & CARE — JavaFX Healthcare Dashboard (Academic Rubric)");

        BorderPane root = new BorderPane();
        root.setStyle("-fx-background-color: #F8FBF9;");

        // 1. Header (VBox)
        VBox headerBox = new VBox(5);
        headerBox.setPadding(new Insets(16, 20, 16, 20));
        headerBox.setStyle("-fx-background-color: #145C4B;");

        Label title = new Label("HEALTH & CARE DASHBOARD");
        title.setFont(Font.font("Segoe UI", FontWeight.BOLD, 22));
        title.setTextFill(Color.WHITE);

        Label subtitle = new Label("JavaFX Practical Demonstration — Summary KPIs, Appointment Dispatcher & Event Handling");
        subtitle.setFont(Font.font("Segoe UI", FontWeight.NORMAL, 13));
        subtitle.setTextFill(Color.web("#E8F6F0"));

        headerBox.getChildren().addAll(title, subtitle);
        root.setTop(headerBox);

        // 2. Center Content (VBox with KPI Cards, Booking Form and TableView)
        VBox centerBox = new VBox(15);
        centerBox.setPadding(new Insets(15, 20, 15, 20));

        // KPI Metric Cards (HBox)
        HBox kpiBox = new HBox(15);
        kpiBox.setAlignment(Pos.CENTER);

        VBox card1 = createKpiCard("Total Patients", "2", "#1B8067");
        totalPatientsLabel = (Label) card1.getChildren().get(1);

        VBox card2 = createKpiCard("Appointments", "2", "#2E7D32");
        totalApptsLabel = (Label) card2.getChildren().get(1);

        VBox card3 = createKpiCard("Specialists Active", "4", "#0277BD");
        VBox card4 = createKpiCard("System Status", "ONLINE", "#00695C");

        kpiBox.getChildren().addAll(card1, card2, card3, card4);
        centerBox.getChildren().add(kpiBox);

        // Quick Appointment Booking Form (GridPane)
        GridPane formGrid = new GridPane();
        formGrid.setHgap(10);
        formGrid.setVgap(10);
        formGrid.setPadding(new Insets(12));
        formGrid.setStyle("-fx-background-color: white; -fx-border-color: #E0E0E0; -fx-border-radius: 8; -fx-background-radius: 8;");

        Label formTitle = new Label("Quick Appointment Dispatcher");
        formTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        formGrid.add(formTitle, 0, 0, 4, 1);

        TextField patientField = new TextField();
        patientField.setPromptText("Patient Name");

        ComboBox<String> doctorCombo = new ComboBox<>();
        doctorCombo.getItems().addAll("Dr. Rajesh Iyer (Cardiology)", "Dr. Sneha Roy (Dental)", "Dr. Vikram Seth (Pediatrics)");
        doctorCombo.setValue("Dr. Rajesh Iyer (Cardiology)");

        TextField dateField = new TextField("2026-11-26 11:00");

        Button bookBtn = new Button("Schedule Appointment");
        bookBtn.setStyle("-fx-background-color: #1B8067; -fx-text-fill: white; -fx-font-weight: bold; -fx-cursor: hand;");

        Button refreshBtn = new Button("Refresh Data");
        refreshBtn.setStyle("-fx-background-color: #E8F6F0; -fx-text-fill: #145C4B; -fx-font-weight: bold; -fx-cursor: hand;");

        formGrid.add(new Label("Patient:"), 0, 1);
        formGrid.add(patientField, 1, 1);
        formGrid.add(new Label("Doctor:"), 2, 1);
        formGrid.add(doctorCombo, 3, 1);

        formGrid.add(new Label("Date/Time:"), 0, 2);
        formGrid.add(dateField, 1, 2);
        formGrid.add(bookBtn, 2, 2);
        formGrid.add(refreshBtn, 3, 2);

        centerBox.getChildren().add(formGrid);

        // TableView for Appointments
        tableView = new TableView<>();
        tableView.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);

        TableColumn<DemoAppointment, Integer> colId = new TableColumn<>("ID");
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colId.setPrefWidth(50);

        TableColumn<DemoAppointment, String> colPatient = new TableColumn<>("Patient Name");
        colPatient.setCellValueFactory(new PropertyValueFactory<>("patientName"));
        colPatient.setPrefWidth(160);

        TableColumn<DemoAppointment, String> colDoctor = new TableColumn<>("Doctor");
        colDoctor.setCellValueFactory(new PropertyValueFactory<>("doctorName"));
        colDoctor.setPrefWidth(160);

        TableColumn<DemoAppointment, String> colDept = new TableColumn<>("Department");
        colDept.setCellValueFactory(new PropertyValueFactory<>("department"));
        colDept.setPrefWidth(140);

        TableColumn<DemoAppointment, String> colDate = new TableColumn<>("Date & Time");
        colDate.setCellValueFactory(new PropertyValueFactory<>("appointmentDate"));
        colDate.setPrefWidth(140);

        TableColumn<DemoAppointment, String> colStatus = new TableColumn<>("Status");
        colStatus.setCellValueFactory(new PropertyValueFactory<>("status"));
        colStatus.setPrefWidth(100);

        tableView.getColumns().addAll(colId, colPatient, colDoctor, colDept, colDate, colStatus);
        tableView.setItems(appointmentData);

        VBox.setVgrow(tableView, Priority.ALWAYS);
        centerBox.getChildren().add(tableView);

        root.setCenter(centerBox);

        // JavaFX Event Handlers (setOnAction)
        bookBtn.setOnAction(e -> {
            String pName = patientField.getText().trim();
            String docFull = doctorCombo.getValue();
            String date = dateField.getText().trim();

            if (pName.isEmpty() || date.isEmpty()) {
                showAlert(Alert.AlertType.WARNING, "Validation Error", "Please provide patient name and date/time.");
                return;
            }

            String docName = docFull.split(" \\(")[0];
            String dept = docFull.contains("(") ? docFull.substring(docFull.indexOf("(") + 1, docFull.indexOf(")")) : "General";

            try {
                DemoAppointment appt = new DemoAppointment(pName, docName, dept, date, "CONFIRMED");
                int id = sqliteService.insertAppointment(appt);
                showAlert(Alert.AlertType.INFORMATION, "Booking Confirmed", "Appointment #" + id + " scheduled and saved via SQLite JDBC!");
                patientField.clear();
                loadData();
            } catch (Exception ex) {
                showAlert(Alert.AlertType.ERROR, "Database Error", ex.getMessage());
            }
        });

        refreshBtn.setOnAction(e -> {
            loadData();
            showAlert(Alert.AlertType.INFORMATION, "Refreshed", "Dashboard data reloaded from SQLite database.");
        });

        loadData();

        Scene scene = new Scene(root, 900, 620);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private VBox createKpiCard(String title, String initialValue, String accentColor) {
        VBox card = new VBox(4);
        card.setPadding(new Insets(12, 18, 12, 18));
        card.setAlignment(Pos.CENTER);
        card.setPrefWidth(200);
        card.setStyle(
            "-fx-background-color: white;" +
            "-fx-border-color: " + accentColor + ";" +
            "-fx-border-width: 0 0 0 4;" +
            "-fx-border-radius: 6;" +
            "-fx-background-radius: 6;" +
            "-fx-effect: dropshadow(three-pass-box, rgba(0,0,0,0.05), 5, 0, 0, 2);"
        );

        Label titleLabel = new Label(title);
        titleLabel.setFont(Font.font("Segoe UI", FontWeight.NORMAL, 12));
        titleLabel.setTextFill(Color.web("#687B74"));

        Label valueLabel = new Label(initialValue);
        valueLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 22));
        valueLabel.setTextFill(Color.web("#193B34"));

        card.getChildren().addAll(titleLabel, valueLabel);
        return card;
    }

    private void loadData() {
        appointmentData.clear();
        List<DemoAppointment> appts = sqliteService.getAllAppointments();
        appointmentData.addAll(appts);

        int patientCount = sqliteService.getAllPatients().size();
        totalPatientsLabel.setText(String.valueOf(patientCount));
        totalApptsLabel.setText(String.valueOf(appts.size()));
    }

    private void showAlert(Alert.AlertType type, String title, String content) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
