/* Steps, commands, checklists, and troubleshooting for the GUI app */
window.LAB_DATA = [
  {
    id: "intro",
    section: "Overview",
    title: "Introduction to Azure Honeypots & T-Pot",
    intro: "This project turns Microsoft Azure into a cybersecurity trap using T-Pot, a multi-service honeypot framework. You’ll walk through cloud setup, VM deployment, opening traffic flow, installing T-Pot, exploring dashboards, and analysing real attack data.",
    image: "assets/introduction.png",
    caption: "How I Turned Azure Into a Cybersecurity Trap with T-Pot.",
    checklist: [
      "Understand what a honeypot is and why it’s useful.",
      "Recognize Azure’s role as the cloud platform hosting the trap.",
      "Know T-Pot as an all-in-one honeypot framework with multiple ports and dashboards."
    ],
    commands: [],
    notes: [
      "A honeypot is a deliberately exposed, fake target designed to attract attackers so you can observe their behaviour safely.",
      "Azure’s free trial and credit make it practical to deploy a relatively powerful VM for learning purposes.",
      "T-Pot bundles many honeypot services and ships with dashboards that make attack data visual and easy to explore."
    ],
    issues: []
  },
  {
    id: "reqs-system",
    section: "Project Requisites",
    title: "Cloud & Cost Requirements",
    intro: "The entire project runs in Microsoft Azure using a free trial account with promotional credit, which is sufficient for the VM size required by T-Pot.",
    image: "assets/system-requirment.png",
    caption: "Azure subscription, region, and VM size used for the honeypot.",
    checklist: [
      "Active Microsoft Azure account (free trial is sufficient).",
      "At least $200 of Azure credit available.",
      "Region selected (e.g., East US 2) for the T-Pot VM.",
      "Willingness to destroy the resource group after the lab to avoid future costs."
    ],
    commands: [],
    notes: [
      "Azure’s free trial credit covers the cost of a reasonably sized VM during the short life of this project.",
      "All resources are placed in a single resource group so they can be deleted in one step after the lab.",
      "Keeping an eye on the estimated VM cost in the portal is a good habit, even when credit covers it."
    ],
    issues: []
  },
  {
    id: "reqs-software",
    section: "Project Requisites",
    title: "Software & Tools",
    intro: "This project uses the Azure portal for cloud configuration and a Linux-based machine (such as Kali or Parrot) as the management and attack workstation.",
    image: "assets/software.png",
    caption: "Software tools used for deploying and interacting with the honeypot.",
    checklist: [
      "Web browser with access to the Azure portal.",
      "Linux workstation (Kali, Parrot, or similar) or any system with SSH and Nmap installed.",
      "Ability to SSH into the Azure VM using username and password.",
      "Basic familiarity with the Linux terminal (dnf, yum, systemctl, etc.)."
    ],
    commands: [],
    notes: [
      "The Azure portal handles VM creation and networking through a graphical interface.",
      "SSH is used for configuring the honeypot VM once it’s running in Azure.",
      "Nmap and a few other tools help validate open ports and services before and after T-Pot installation."
    ],
    issues: []
  },
  {
    id: "method",
    section: "Methodology",
    title: "Methodology Phases",
    intro: "The methodology is split into four main phases: Cloud Setup, Honeypot Deployment, Exposure & Observation, and Review.",
    image: "assets/methodology.png",
    caption: "Structured approach to turning Azure into a honeypot.",
    checklist: [
      "Set up the Azure environment and VM.",
      "Install and configure T-Pot on the VM.",
      "Deliberately expose the honeypot and observe attacks.",
      "Review results, insights, and limitations."
    ],
    commands: [],
    notes: [
      "Breaking the project into phases keeps the workflow organized and makes troubleshooting easier.",
      "Cloud configuration and OS configuration are treated separately to reduce confusion.",
      "The final review phase focuses on insights gained from real attack data rather than synthetic tests."
    ],
    issues: []
  },
  {
    id: "env",
    section: "Setup",
    title: "Azure Resource Group & Virtual Machine",
    intro: "A dedicated resource group and VM are created in Azure to isolate the honeypot and make cleanup as simple as deleting one group.",
    image: "assets/step-1.png",
    caption: "Creating the tpot-rg resource group and T-Pot VM in Azure.",
    checklist: [
      "Create a new resource group (e.g., tpot-rg).",
      "Create a VM in that group with a suitable name (e.g., tpot-vm).",
      "Select a region (e.g., East US 2).",
      "Choose a size like Standard_B4ms (4 vCPUs, 16 GiB).",
      "Set disk size to around 256 GiB.",
      "Enable the option to delete public IP and NIC when the VM is deleted."
    ],
    commands: [
      {
        title: "Optional: Delete everything after the lab (Azure CLI)",
        code: "az group delete --name tpot-rg --yes --no-wait"
      }
    ],
    notes: [
      "Using a single resource group makes teardown trivial—delete the group and the entire lab disappears.",
      "A VM size with at least 16 GiB RAM is recommended because T-Pot runs multiple honeypot services and dashboards.",
      "Choosing a nearby region can reduce latency when accessing dashboards from your workstation."
    ],
    issues: [
      {
        title: "Resource group or VM fails validation",
        severity: "Azure",
        body: [
          "Incorrect region, quota limitations, or missing subscription details can cause validation to fail."
        ],
        fixes: [
          {
            label: "Check subscription & quotas",
            code: "# In Azure Portal:\n# 1. Verify your subscription is active.\n# 2. Try a different VM size if quotas are low.\n# 3. Re-run validation after fixing errors."
          }
        ]
      }
    ]
  },
  {
  "id": "install",
  "section": "Setup",
  "title": "Opening Traffic Flow with NSG Rules",
  "intro": "The honeypot’s whole purpose is to be attacked, so the Network Security Group (NSG) is intentionally configured to allow all inbound traffic to the VM. Be sure to follow the corresponding PDF instructions for guidance.",
  "image": "assets/step-2.png",
  "caption": "Creating a high-priority NSG rule (Danger_allow_all) that opens all ports.",
  "checklist": [
    "Locate the VM’s Network Security Group in Azure.",
    "Add an inbound security rule that allows any protocol, any port.",
    "Set a low priority number (e.g., 100) so the rule is evaluated first.",
    "Name the rule clearly (e.g., Danger_allow_all).",
    "Confirm that the rule applies to the honeypot VM’s NIC."
  ],
  "commands": [
    {
      "title": "Example NSG rule via Azure CLI",
      "code": "az network nsg rule create \\\n  --resource-group tpot-rg \\\n  --nsg-name tpot-vm-nsg \\\n  --name Danger_allow_all \\\n  --priority 100 \\\n  --direction Inbound \\\n  --access Allow \\\n  --protocol '*' \\\n  --source-address-prefixes '*' \\\n  --source-port-ranges '*' \\\n  --destination-address-prefixes '*' \\\n  --destination-port-ranges '*'"
    }
  ],
  "notes": [
    "This configuration is intentionally insecure and should only be used in a controlled lab environment.",
    "In real-world deployments, such an open NSG rule would be extremely dangerous and never recommended.",
    "Because traffic is wide open, the honeypot quickly collects scans and attack attempts from the internet.",
    "Remember to delete the VM and resource group once the experiment is over."
  ],
  "issues": [
    {
      "title": "NSG rule not taking effect",
      "severity": "Network",
      "body": [
        "If traffic still appears blocked, the new rule may not be applied to the correct NIC or may be overshadowed by another rule with higher priority."
      ],
      "fixes": [
        {
          "label": "Verify NSG association",
          "code": "# In Azure Portal:\n# 1. Open the VM's Networking blade.\n# 2. Confirm the NIC is attached to tpot-vm-nsg.\n# 3. Ensure the Danger_allow_all rule has a lower priority number\n#    (e.g., 100) than more restrictive rules."
        }
      ]
    }
  ]
  },
  {
    id: "dashboard",
    section: "Setup",
    title: "SSH into the VM & Pre-Install Checks",
    intro: "Connect to the Azure VM over SSH, create a non-root user with sudo privileges, update the system, and verify that only SSH is open before installing T-Pot.",
    image: "assets/step-3.png",
    caption: "Connecting to the VM and preparing AlmaLinux for T-Pot.",
    checklist: [
      "Retrieve the VM’s public IP address from the Azure portal.",
      "SSH into the VM using the administrative username and password.",
      "Create a non-root user with a home directory and shell.",
      "Grant sudo privileges to the new user.",
      "Update the system and install basic tools like Nmap.",
      "Verify only port 22 (SSH) is open before installing T-Pot."
    ],
    commands: [
      {
        title: "SSH into the Azure VM",
        code: "ssh <azure_username>@<vm_public_ip>"
      },
      {
        title: "Create non-root user with sudo",
        code: "sudo useradd -m -d /home/newuser -s /bin/bash newuser\nsudo passwd newuser\nsudo usermod -aG wheel newuser"
      },
      {
        title: "Update system and install Nmap (AlmaLinux)",
        code: "sudo dnf update -y\nsudo dnf upgrade -y\nsudo dnf install -y nmap lynx screen grc"
      },
      {
        title: "Log in as the non-root user",
        code: "su newuser"
      },
      {
        title: "Check that only SSH is open",
        code: "nmap -p- localhost"
      }
    ],
    notes: [
      "Working from a non-root user reduces the risk of accidental system-wide damage.",
      "Running Nmap locally before T-Pot installation shows a clean baseline of open ports.",
      "Installing helpful utilities (like screen) can make long installs more manageable, but Nmap is the most critical tool here."
    ],
    issues: [
      {
        title: "SSH connection fails",
        severity: "Access",
        body: [
          "An incorrect username, wrong public IP, or blocked inbound rule can prevent SSH from working."
        ],
        fixes: [
          {
            label: "Confirm SSH details",
            code: "# In Azure Portal:\n# 1. Check the VM's public IP.\n# 2. Make sure the NSG allows inbound SSH (port 22).\n# 3. Verify you’re using the correct username defined at VM creation."
          }
        ]
      },
      {
        title: "Cannot switch to new user",
        severity: "Linux",
        body: [
          "If su newuser fails, the account may not exist or may not have a valid shell."
        ],
        fixes: [
          {
            label: "Recreate or fix the user",
            code: "sudo useradd -m -d /home/newuser -s /bin/bash newuser\nsudo passwd newuser"
          }
        ]
      }
    ]
  },
  {
    id: "agents",
    section: "Deployment",
    title: "Installing the T-Pot Honeypot Framework",
    intro: "With the VM ready, T-Pot is installed from its official GitHub repository. This pulls in all components that turn the VM into a full honeypot system.",
    image: "assets/step-4-linux.png",
    caption: "Cloning the T-Pot repository and running the installer.",
    checklist: [
      "Install prerequisite packages (Python and Git).",
      "Clone the official T-Pot Community Edition repository.",
      "Change into the tpotce directory.",
      "Run the installation script as root.",
      "Select the desired T-Pot profile (e.g., Standard / HIVE).",
      "Create a web user and password when prompted.",
      "Reboot the server after installation completes."
    ],
    commands: [
      {
        title: "Install prerequisites & clone T-Pot",
        code: "sudo yum update -y\nsudo yum install -y python3 git\ngit clone https://github.com/telekom-security/tpotce.git"
      },
      {
        title: "Run the installer",
        code: "cd tpotce\nsudo ./install.sh\n# When prompted, choose the 'h' profile for T-Pot Standard / HIVE\n# and set a web username and password."
      }
    ],
    notes: [
      "The installer configures multiple honeypot services, containers, and dashboards in one go.",
      "Installation can take several minutes, depending on VM size and network speed.",
      "Rebooting after completion ensures T-Pot services start cleanly on boot."
    ],
    issues: [
      {
        title: "Installer fails on missing packages",
        severity: "Install",
        body: [
          "If dependencies are missing or outdated, the installer may stop partway through."
        ],
        fixes: [
          {
            label: "Re-run updates and retry",
            code: "sudo yum update -y\nsudo yum install -y python3 git\ncd tpotce\nsudo ./install.sh"
          }
        ]
      },
      {
        title: "Forgot web UI credentials",
        severity: "Auth",
        body: [
          "If you forget the username or password you set during installation, you may need to reset them or reinstall in a lab setting."
        ],
        fixes: [
          {
            label: "Check documentation or reinstall (lab)",
            code: "# In a disposable lab environment, the simplest fix is often to\n# redeploy the VM and rerun the T-Pot installer, carefully\n# storing the chosen credentials this time."
          }
        ]
      }
    ]
  },
  {
    id: "tests-fim",
    section: "Validation",
    title: "Verifying T-Pot Services & Open Ports",
    intro: "After installation and reboot, verify that T-Pot services are running and that the expected ports are listening for inbound traffic.",
    image: "assets/step-5-fim.png",
    caption: "Checking running services and listening ports after T-Pot installation.",
    checklist: [
      "SSH back into the VM after reboot.",
      "List running services or containers.",
      "Install net-tools if needed for netstat.",
      "Check all listening ports.",
      "Optionally scan the public IP from an external machine using Nmap.",
      "Confirm that many ports are now exposed by T-Pot."
    ],
    commands: [
      {
        title: "List running services",
        code: "sudo systemctl list-units --type=service --state=running"
      },
      {
        title: "Install netstat and check listening ports",
        code: "sudo dnf install -y net-tools\nsudo netstat -tulpen"
      },
      {
        title: "External Nmap scan from your workstation",
        code: "nmap -p- <vm_public_ip>"
      }
    ],
    notes: [
      "Compared to the pre-install baseline, you should now see a large number of open ports associated with honeypot services.",
      "An external Nmap scan simulates what an internet scanner would see when probing your honeypot.",
      "Multiple listening ports are expected in a honeypot like T-Pot; the system is intentionally noisy to attract attacks."
    ],
    issues: [
      {
        title: "No new ports visible after install",
        severity: "Services",
        body: [
          "If services are not running, T-Pot may not have started correctly after reboot."
        ],
        fixes: [
          {
            label: "Check status and logs",
            code: "sudo systemctl list-units --type=service --state=failed\n# Investigate any failed T-Pot-related service and consider rerunning the installer if necessary."
          }
        ]
      }
    ]
  },
  {
    id: "tests-logs",
    section: "Validation",
    title: "Exploring the T-Pot Web Portal & Dashboards",
    intro: "T-Pot exposes a web portal where you can access dashboards and visualizations for the captured attack data.",
    image: "assets/step-5-logs.png",
    caption: "T-Pot landing page and dashboards accessible via HTTPS.",
    checklist: [
      "Confirm the VM’s public IP is reachable over HTTPS on the T-Pot portal port.",
      "Open the T-Pot landing page from your browser.",
      "Log in using the web credentials set during installation.",
      "Navigate to Kibana, Grafana, or other dashboards from the portal.",
      "Verify that basic system and attack information is visible."
    ],
    commands: [
      {
        title: "Open T-Pot landing page",
        code: "https://<vm_public_ip>:64297/"
      }
    ],
    notes: [
      "The T-Pot portal aggregates links to the various dashboards it exposes.",
      "Kibana and similar tools provide rich visualizations of logs and attack events.",
      "Initial dashboards may look quiet; as the VM spends more time online, attack data accumulates rapidly."
    ],
    issues: [
      {
        title: "Cannot reach the T-Pot portal",
        severity: "Access",
        body: [
          "If the portal is unreachable, HTTPS traffic to the portal port may be blocked or T-Pot services may not be running."
        ],
        fixes: [
          {
            label: "Check NSG and service status",
            code: "# In Azure Portal, ensure Danger_allow_all (or a rule allowing 64297)\n# is active.\n# On the VM:\nsudo netstat -tulpen | grep 64297 || echo 'Portal port not listening'"
          }
        ]
      }
    ]
  },
  {
    id: "tests-ids",
    section: "Validation",
    title: "Generating Attack Traffic & Observing Events",
    intro: "To see the honeypot in action, intentionally generate scan and probe traffic against the T-Pot instance from your external workstation.",
    checklist: [
      "From your Kali/Parrot (or other) machine, run Nmap scans against the VM’s public IP.",
      "Use different scan types and intensity levels.",
      "Give the honeypot some time to collect additional attacks from the internet.",
      "Refresh dashboards and review new events.",
      "Identify interesting attack patterns, source IPs, and targeted ports."
    ],
    commands: [
      {
        title: "Intense Nmap scan from external machine",
        code: "nmap -sC -sV -p- <vm_public_ip>"
      }
    ],
    notes: [
      "Even without your manual scans, internet background noise will quickly generate hits against the exposed honeypot.",
      "Your own scans are useful for confirming data flow from probe to dashboard.",
      "Dashboards often show source IP geography, attack types, and targeted services in near real time."
    ],
    issues: [
      {
        title: "No events visible after scans",
        severity: "Detection",
        body: [
          "If your scans don’t appear, there may be a delay in indexing or an issue with data pipelines."
        ],
        fixes: [
          {
            label: "Wait, rescan, and check indices",
            code: "# 1. Wait a few minutes and refresh dashboards.\n# 2. Run another scan with:\nnmap -sC -sV -p- <vm_public_ip>\n# 3. In Kibana, confirm that the relevant indices are present and not in error."
          }
        ]
      }
    ]
  },
  {
    id: "review",
    section: "Review",
    title: "Findings and Downsides",
    intro: "T-Pot on Azure proved powerful for visualizing real attack traffic, but it also surfaced several practical and operational challenges.",
    image: "assets/review.png",
    caption: "Summary of T-Pot’s downsides and operational considerations.",
    checklist: [
      "Cloud costs can increase if the VM is left running long-term.",
      "Keeping all ports open is only acceptable in isolated lab scenarios.",
      "Resource requirements are relatively high for smaller budgets.",
      "Managing and securing access to dashboards requires care."
    ],
    commands: [],
    notes: [
      "While the free credit covers the lab, forgetting to delete resources can consume credit or incur charges later.",
      "A fully exposed NSG is never appropriate for production but is useful here to attract as much malicious traffic as possible.",
      "T-Pot’s richness comes at the cost of CPU, memory, and storage; underpowered VMs may struggle.",
      "Understanding these trade-offs is critical before considering any honeypot in a more permanent environment."
    ],
    issues: []
  },
  {
    id: "capabilities",
    section: "Review",
    title: "Capabilities of T-Pot as a Honeypot Platform",
    intro: "Beyond basic port exposure, T-Pot brings together multiple honeypot services, log pipelines, and dashboards into a single, cohesive platform.",
    image: "assets/capabilities.png",
    caption: "Extended T-Pot features for attack analysis and research.",
    checklist: [
      "Multiple honeypot daemons simulating different services and protocols.",
      "Centralized collection and visualization of attack data.",
      "Integration with tools like Kibana and Grafana.",
      "Support for research, learning, and threat intelligence use cases."
    ],
    commands: [],
    notes: [
      "T-Pot effectively acts as a security research lab in a box, capturing attacks across many ports and protocols.",
      "Dashboards simplify exploring attack timelines, geolocation, and techniques at a glance.",
      "Because everything is containerized, updates and maintenance are generally easier compared to stitching many standalone honeypots together manually."
    ],
    issues: []
  },
  {
    id: "conclusion",
    section: "Wrap-Up",
    title: "Conclusion",
    intro: "Turning Azure into a cybersecurity trap with T-Pot demonstrates how cloud infrastructure can be repurposed to safely study attacker behaviour at scale.",
    checklist: [
      "Azure VM and networking successfully configured.",
      "T-Pot installed, exposed, and confirmed to be receiving traffic.",
      "Dashboards used to review real-world attacks hitting the honeypot."
    ],
    commands: [],
    notes: [
      "Project-style honeypots like this provide hands-on insight that theory alone cannot offer.",
      "Cloud platforms make it easy to deploy and destroy complex environments quickly and safely.",
      "The skills learned here—cloud provisioning, controlled exposure, and log analysis—translate directly to defensive security and threat hunting work."
    ],
    issues: []
  },
  {
    id: "sources",
    section: "Appendix",
    title: "References",
    intro: "Key references and official resources used while designing and implementing this Azure honeypot project.",
    checklist: [
      "Microsoft Azure documentation for virtual machines and NSG configuration.",
      "Official T-Pot Community Edition repository and documentation.",
      "Security references on honeypots and attack analysis."
    ],
    commands: [
      {
        title: "Reference links",
        code: "https://learn.microsoft.com/azure/virtual-machines/\nhttps://learn.microsoft.com/azure/virtual-network/network-security-groups-overview\nhttps://github.com/telekom-security/tpotce\nhttps://en.wikipedia.org/wiki/Honeypot_(computing)"
      }
    ],
    notes: [],
    issues: []
  }
];
