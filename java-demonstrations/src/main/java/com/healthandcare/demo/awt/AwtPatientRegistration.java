package com.healthandcare.demo.awt;

import com.healthandcare.demo.database.SqliteDemoService;
import com.healthandcare.demo.models.DemoPatient;

import java.awt.*;
import java.awt.event.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Mandatory AWT Implementation for Health & Care Academic Rubric.
 * Demonstrates:
 * - Frame, Label, TextField, Button, Choice, Panel
 * - Layout Managers (BorderLayout, GridLayout, FlowLayout)
 * - Java Event Handling: ActionListener, ItemListener, WindowListener
 * - Input validation & SQLite Database persistence
 */
public class AwtPatientRegistration extends Frame implements ActionListener, ItemListener, WindowListener {

    private final TextField nameField;
    private final TextField emailField;
    private final TextField phoneField;
    private final Choice genderChoice;
    private final Button submitButton;
    private final Button clearButton;
    private final Button viewDbButton;
    private final Label statusLabel;
    private final SqliteDemoService sqliteService;

    public AwtPatientRegistration() {
        super("HEALTH & CARE — AWT Patient Registration (Academic Rubric)");
        this.sqliteService = new SqliteDemoService();

        // Window properties
        setSize(560, 480);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(15, 15));
        setBackground(new Color(248, 251, 249)); // Healthcare mint tint

        // 1. Header Panel
        Panel headerPanel = new Panel(new GridLayout(2, 1));
        headerPanel.setBackground(new Color(20, 92, 75)); // Healthcare deep green
        Label mainTitle = new Label("HEALTH & CARE MANAGEMENT", Label.CENTER);
        mainTitle.setFont(new Font("Arial", Font.BOLD, 18));
        mainTitle.setForeground(Color.WHITE);

        Label subTitle = new Label("AWT Desktop Demonstration — Patient Registration & SQLite JDBC", Label.CENTER);
        subTitle.setFont(new Font("Arial", Font.PLAIN, 12));
        subTitle.setForeground(new Color(232, 246, 240));

        headerPanel.add(mainTitle);
        headerPanel.add(subTitle);
        add(headerPanel, BorderLayout.NORTH);

        // 2. Form Panel (GridLayout)
        Panel formPanel = new Panel(new GridLayout(5, 2, 10, 15));
        formPanel.setBackground(new Color(248, 251, 249));

        Font labelFont = new Font("Arial", Font.BOLD, 13);
        Font fieldFont = new Font("Arial", Font.PLAIN, 13);

        Label l1 = new Label("  Patient Full Name *:");
        l1.setFont(labelFont);
        nameField = new TextField(25);
        nameField.setFont(fieldFont);

        Label l2 = new Label("  Email Address *:");
        l2.setFont(labelFont);
        emailField = new TextField(25);
        emailField.setFont(fieldFont);

        Label l3 = new Label("  Phone Number *:");
        l3.setFont(labelFont);
        phoneField = new TextField(25);
        phoneField.setFont(fieldFont);

        Label l4 = new Label("  Gender Selection *:");
        l4.setFont(labelFont);
        genderChoice = new Choice();
        genderChoice.setFont(fieldFont);
        genderChoice.add("Male");
        genderChoice.add("Female");
        genderChoice.add("Other");
        genderChoice.addItemListener(this); // Event Handling: ItemListener

        Label l5 = new Label("  System Target DB:");
        l5.setFont(labelFont);
        Label dbTypeLabel = new Label("SQLite JDBC (health_and_care_demo.db)");
        dbTypeLabel.setFont(new Font("Arial", Font.ITALIC, 12));
        dbTypeLabel.setForeground(new Color(27, 128, 103));

        formPanel.add(l1); formPanel.add(nameField);
        formPanel.add(l2); formPanel.add(emailField);
        formPanel.add(l3); formPanel.add(phoneField);
        formPanel.add(l4); formPanel.add(genderChoice);
        formPanel.add(l5); formPanel.add(dbTypeLabel);

        // Wrap form in padding panel
        Panel centerWrapper = new Panel(new BorderLayout());
        centerWrapper.add(formPanel, BorderLayout.CENTER);
        add(centerWrapper, BorderLayout.CENTER);

        // 3. Footer / Button Panel
        Panel bottomPanel = new Panel(new BorderLayout(5, 5));
        bottomPanel.setBackground(new Color(232, 246, 240));

        Panel buttonPanel = new Panel(new FlowLayout(FlowLayout.CENTER, 15, 10));
        submitButton = new Button("Register Patient (SQLite)");
        submitButton.setBackground(new Color(27, 128, 103));
        submitButton.setForeground(Color.WHITE);
        submitButton.setFont(new Font("Arial", Font.BOLD, 13));
        submitButton.addActionListener(this); // Event Handling: ActionListener

        clearButton = new Button("Clear Form");
        clearButton.setBackground(new Color(220, 220, 220));
        clearButton.setFont(new Font("Arial", Font.PLAIN, 12));
        clearButton.addActionListener(this); // Event Handling: ActionListener

        viewDbButton = new Button("View SQLite Records");
        viewDbButton.setBackground(new Color(20, 92, 75));
        viewDbButton.setForeground(Color.WHITE);
        viewDbButton.setFont(new Font("Arial", Font.PLAIN, 12));
        viewDbButton.addActionListener(this); // Event Handling: ActionListener

        buttonPanel.add(submitButton);
        buttonPanel.add(clearButton);
        buttonPanel.add(viewDbButton);

        statusLabel = new Label("Ready. Enter patient details and click Register.", Label.CENTER);
        statusLabel.setFont(new Font("Arial", Font.BOLD, 12));
        statusLabel.setForeground(new Color(25, 59, 52));

        bottomPanel.add(buttonPanel, BorderLayout.NORTH);
        bottomPanel.add(statusLabel, BorderLayout.SOUTH);
        add(bottomPanel, BorderLayout.SOUTH);

        // Event Handling: WindowListener to close window gracefully
        addWindowListener(this);
    }

    // Java Event Handling: ActionListener
    @Override
    public void actionPerformed(ActionEvent e) {
        Object src = e.getSource();
        if (src == submitButton) {
            handleRegister();
        } else if (src == clearButton) {
            handleClear();
        } else if (src == viewDbButton) {
            handleViewDatabase();
        }
    }

    private void handleRegister() {
        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String phone = phoneField.getText().trim();
        String gender = genderChoice.getSelectedItem();

        // Validation
        if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {
            statusLabel.setText("❌ Validation Error: Name, Email and Phone are required!");
            statusLabel.setForeground(Color.RED);
            return;
        }

        if (!email.contains("@") || !email.contains(".")) {
            statusLabel.setText("❌ Validation Error: Please enter a valid email address!");
            statusLabel.setForeground(Color.RED);
            return;
        }

        try {
            DemoPatient patient = new DemoPatient(name, email, phone, gender, LocalDate.now().toString());
            int generatedId = sqliteService.insertPatient(patient);
            statusLabel.setText("✅ SUCCESS: Patient #" + generatedId + " registered & persisted in SQLite DB!");
            statusLabel.setForeground(new Color(20, 92, 75));
            handleClear();
        } catch (Exception ex) {
            statusLabel.setText("❌ SQLite DB Error: " + ex.getMessage());
            statusLabel.setForeground(Color.RED);
        }
    }

    private void handleClear() {
        nameField.setText("");
        emailField.setText("");
        phoneField.setText("");
        genderChoice.select(0);
    }

    private void handleViewDatabase() {
        List<DemoPatient> patients = sqliteService.getAllPatients();
        Dialog dialog = new Dialog(this, "SQLite Patients Table (" + patients.size() + " Records)", true);
        dialog.setSize(480, 320);
        dialog.setLocationRelativeTo(this);
        dialog.setLayout(new BorderLayout(10, 10));

        TextArea textArea = new TextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 12));

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%-5s | %-18s | %-20s | %-8s\n", "ID", "Name", "Email", "Gender"));
        sb.append("----------------------------------------------------------------------\n");
        for (DemoPatient p : patients) {
            sb.append(String.format("%-5d | %-18s | %-20s | %-8s\n", p.getId(), p.getName(), p.getEmail(), p.getGender()));
        }
        textArea.setText(sb.toString());

        Button closeBtn = new Button("Close");
        closeBtn.addActionListener(evt -> dialog.dispose());

        dialog.add(textArea, BorderLayout.CENTER);
        dialog.add(closeBtn, BorderLayout.SOUTH);
        dialog.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                dialog.dispose();
            }
        });
        dialog.setVisible(true);
    }

    // Java Event Handling: ItemListener
    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource() == genderChoice) {
            statusLabel.setText("Selected Gender: " + genderChoice.getSelectedItem());
            statusLabel.setForeground(new Color(27, 128, 103));
        }
    }

    // Java Event Handling: WindowListener
    @Override public void windowOpened(WindowEvent e) {}
    @Override public void windowClosing(WindowEvent e) { dispose(); }
    @Override public void windowClosed(WindowEvent e) {}
    @Override public void windowIconified(WindowEvent e) {}
    @Override public void windowDeiconified(WindowEvent e) {}
    @Override public void windowActivated(WindowEvent e) {}
    @Override public void windowDeactivated(WindowEvent e) {}

    public static void main(String[] args) {
        EventQueue.invokeLater(() -> {
            AwtPatientRegistration window = new AwtPatientRegistration();
            window.setVisible(true);
        });
    }
}
