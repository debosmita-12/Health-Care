package com.healthandcare.demo.swing;

import com.healthandcare.demo.database.SqliteDemoService;
import com.healthandcare.demo.models.DemoAppointment;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;

/**
 * Mandatory Swing Implementation for Health & Care Academic Rubric.
 * Demonstrates:
 * - JFrame, JPanel, JLabel, JTextField, JButton, JComboBox, JTable, JOptionPane, JScrollPane
 * - Event Handling: ActionListener, MouseListener
 * - Full CRUD Operations via SQLite JDBC:
 *   - Create (Add Appointment)
 *   - Read (View in JTable)
 *   - Update (Update Selected Status/Date)
 *   - Delete (Remove from Database)
 */
public class SwingAppointmentManager extends JFrame implements ActionListener {

    private final JTextField patientNameField;
    private final JComboBox<String> doctorCombo;
    private final JComboBox<String> deptCombo;
    private final JTextField dateTimeField;
    private final JComboBox<String> statusCombo;

    private final JButton addButton;
    private final JButton updateButton;
    private final JButton deleteButton;
    private final JButton refreshButton;
    private final JButton testCrudButton;

    private final JTable appointmentTable;
    private final DefaultTableModel tableModel;
    private final SqliteDemoService sqliteService;

    private int selectedAppointmentId = -1;

    public SwingAppointmentManager() {
        super("HEALTH & CARE — Swing Appointment Management System (Academic Rubric)");
        this.sqliteService = new SqliteDemoService();

        setSize(850, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // 1. Header Banner
        JPanel headerPanel = new JPanel(new GridLayout(2, 1, 4, 4));
        headerPanel.setBackground(new Color(20, 92, 75)); // Healthcare deep green
        headerPanel.setBorder(BorderFactory.createEmptyBorder(12, 16, 12, 16));

        JLabel titleLabel = new JLabel("HEALTH & CARE CLINICAL PORTAL");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        titleLabel.setForeground(Color.WHITE);

        JLabel subtitleLabel = new JLabel("Swing Desktop Demonstration — Appointment Scheduling & Real JDBC Persistence");
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitleLabel.setForeground(new Color(232, 246, 240));

        headerPanel.add(titleLabel);
        headerPanel.add(subtitleLabel);
        add(headerPanel, BorderLayout.NORTH);

        // 2. Center: Form Panel (North of center) and Table Panel (Center)
        JPanel centerContainer = new JPanel(new BorderLayout(10, 10));
        centerContainer.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));

        // Input Form
        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createTitledBorder("Appointment Information Form"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Row 0
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Patient Full Name:"), gbc);
        gbc.gridx = 1; gbc.gridy = 0;
        patientNameField = new JTextField(15);
        formPanel.add(patientNameField, gbc);

        gbc.gridx = 2; gbc.gridy = 0;
        formPanel.add(new JLabel("Department:"), gbc);
        gbc.gridx = 3; gbc.gridy = 0;
        deptCombo = new JComboBox<>(new String[]{"General Medicine", "Cardiology", "Dental & Maxillofacial", "Pediatrics", "Orthopedics"});
        formPanel.add(deptCombo, gbc);

        // Row 1
        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Assigned Doctor:"), gbc);
        gbc.gridx = 1; gbc.gridy = 1;
        doctorCombo = new JComboBox<>(new String[]{"Dr. Rajesh Iyer", "Dr. Sneha Roy", "Dr. Vikram Seth", "Dr. Ananya Sen"});
        formPanel.add(doctorCombo, gbc);

        gbc.gridx = 2; gbc.gridy = 1;
        formPanel.add(new JLabel("Date & Time:"), gbc);
        gbc.gridx = 3; gbc.gridy = 1;
        dateTimeField = new JTextField("2026-11-25 10:00", 15);
        formPanel.add(dateTimeField, gbc);

        // Row 2
        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Appointment Status:"), gbc);
        gbc.gridx = 1; gbc.gridy = 2;
        statusCombo = new JComboBox<>(new String[]{"PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"});
        formPanel.add(statusCombo, gbc);

        centerContainer.add(formPanel, BorderLayout.NORTH);

        // Table
        String[] columns = {"ID", "Patient Name", "Doctor", "Department", "Date & Time", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // read-only cells
            }
        };
        appointmentTable = new JTable(tableModel);
        appointmentTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        appointmentTable.setRowHeight(24);
        appointmentTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 12));
        appointmentTable.getTableHeader().setBackground(new Color(232, 246, 240));

        appointmentTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int row = appointmentTable.getSelectedRow();
                if (row >= 0) {
                    selectedAppointmentId = (int) tableModel.getValueAt(row, 0);
                    patientNameField.setText((String) tableModel.getValueAt(row, 1));
                    doctorCombo.setSelectedItem(tableModel.getValueAt(row, 2));
                    deptCombo.setSelectedItem(tableModel.getValueAt(row, 3));
                    dateTimeField.setText((String) tableModel.getValueAt(row, 4));
                    statusCombo.setSelectedItem(tableModel.getValueAt(row, 5));
                }
            }
        });

        JScrollPane tableScroll = new JScrollPane(appointmentTable);
        tableScroll.setBorder(BorderFactory.createTitledBorder("Appointments List (Persisted via SQLite JDBC)"));
        centerContainer.add(tableScroll, BorderLayout.CENTER);

        add(centerContainer, BorderLayout.CENTER);

        // 3. Bottom Button Panel
        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 12));
        actionPanel.setBackground(new Color(248, 251, 249));

        addButton = new JButton("Add Appointment");
        addButton.setBackground(new Color(27, 128, 103));
        addButton.setForeground(Color.WHITE);
        addButton.addActionListener(this);

        updateButton = new JButton("Update Status");
        updateButton.setBackground(new Color(20, 92, 75));
        updateButton.setForeground(Color.WHITE);
        updateButton.addActionListener(this);

        deleteButton = new JButton("Delete Appointment");
        deleteButton.setBackground(new Color(180, 40, 40));
        deleteButton.setForeground(Color.WHITE);
        deleteButton.addActionListener(this);

        refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(this);

        testCrudButton = new JButton("Run Full CRUD Test");
        testCrudButton.addActionListener(this);

        actionPanel.add(addButton);
        actionPanel.add(updateButton);
        actionPanel.add(deleteButton);
        actionPanel.add(refreshButton);
        actionPanel.add(testCrudButton);

        add(actionPanel, BorderLayout.SOUTH);

        // Load initial data
        refreshTable();
    }

    private void refreshTable() {
        tableModel.setRowCount(0);
        List<DemoAppointment> list = sqliteService.getAllAppointments();
        for (DemoAppointment a : list) {
            tableModel.addRow(new Object[]{
                a.getId(),
                a.getPatientName(),
                a.getDoctorName(),
                a.getDepartment(),
                a.getAppointmentDate(),
                a.getStatus()
            });
        }
    }

    // Java Event Handling: ActionListener
    @Override
    public void actionPerformed(ActionEvent e) {
        Object src = e.getSource();

        if (src == addButton) {
            handleAdd();
        } else if (src == updateButton) {
            handleUpdate();
        } else if (src == deleteButton) {
            handleDelete();
        } else if (src == refreshButton) {
            refreshTable();
            JOptionPane.showMessageDialog(this, "Table refreshed from SQLite database.", "Refreshed", JOptionPane.INFORMATION_MESSAGE);
        } else if (src == testCrudButton) {
            boolean success = sqliteService.runFullCrudDemo();
            refreshTable();
            JOptionPane.showMessageDialog(this,
                success ? "SQLite CRUD Test PASSED 100%! Check console for detailed execution logs." : "SQLite CRUD test encountered an error.",
                "Rubric SQLite Verification",
                success ? JOptionPane.INFORMATION_MESSAGE : JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleAdd() {
        String patient = patientNameField.getText().trim();
        String doctor = (String) doctorCombo.getSelectedItem();
        String dept = (String) deptCombo.getSelectedItem();
        String date = dateTimeField.getText().trim();
        String status = (String) statusCombo.getSelectedItem();

        if (patient.isEmpty() || date.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Patient Name and Date/Time cannot be empty!", "Input Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            DemoAppointment appt = new DemoAppointment(patient, doctor, dept, date, status);
            int id = sqliteService.insertAppointment(appt);
            refreshTable();
            JOptionPane.showMessageDialog(this, "Appointment successfully booked and persisted in SQLite! ID: " + id, "Success", JOptionPane.INFORMATION_MESSAGE);
            patientNameField.setText("");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleUpdate() {
        if (selectedAppointmentId <= 0) {
            JOptionPane.showMessageDialog(this, "Please select an appointment from the table to update.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String newStatus = (String) statusCombo.getSelectedItem();
        try {
            boolean updated = sqliteService.updateAppointmentStatus(selectedAppointmentId, newStatus);
            if (updated) {
                refreshTable();
                JOptionPane.showMessageDialog(this, "Appointment #" + selectedAppointmentId + " status updated to " + newStatus, "Updated", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Failed to update record in database.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleDelete() {
        if (selectedAppointmentId <= 0) {
            JOptionPane.showMessageDialog(this, "Please select an appointment from the table to delete.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete appointment #" + selectedAppointmentId + "?", "Confirm Delete", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            try {
                boolean deleted = sqliteService.deleteAppointment(selectedAppointmentId);
                if (deleted) {
                    refreshTable();
                    JOptionPane.showMessageDialog(this, "Appointment #" + selectedAppointmentId + " deleted from SQLite database.", "Deleted", JOptionPane.INFORMATION_MESSAGE);
                    selectedAppointmentId = -1;
                    patientNameField.setText("");
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
            SwingAppointmentManager window = new SwingAppointmentManager();
            window.setVisible(true);
        });
    }
}
