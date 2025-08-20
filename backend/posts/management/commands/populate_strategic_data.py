from django.core.management.base import BaseCommand
from posts.models_department import Branch
from posts.models_strategic_objectives import StrategicObjective, KeyMetric, ActionItem

class Command(BaseCommand):
    help = 'Populate sample strategic objectives data'

    def handle(self, *args, **options):
        # Create sample branches if they don't exist
        medical_services, created = Branch.objects.get_or_create(
            name='Medical Services',
            defaults={'head': 'Dr. Sarah Johnson'}
        )
        
        finance, created = Branch.objects.get_or_create(
            name='Finance',
            defaults={'head': 'Mr. Michael Chen'}
        )
        
        strategy_innovation, created = Branch.objects.get_or_create(
            name='Strategy & Innovation',
            defaults={'head': 'Ms. Emma Rodriguez'}
        )

        # Medical Services Strategic Objectives
        medical_objectives = [
            {
                'title': 'Enhance comprehensive clinical outcomes',
                'description': 'Improve patient care quality, safety protocols, and clinical effectiveness across all medical services',
                'progress': 75,
                'status': 'on_track',
                'target': '95% Clinical Excellence',
                'deadline': 'Q4 2024',
                'priority': 'high'
            },
            {
                'title': 'Enhance effectiveness in Corporate Governance Oversight',
                'description': 'Strengthen governance frameworks, compliance monitoring, and quality assurance systems',
                'progress': 75,
                'status': 'on_track',
                'target': '100% Compliance',
                'deadline': 'Q3 2024',
                'priority': 'high'
            },
            {
                'title': "Enhance customers' expected preferences, convenience and speed in healthcare provision",
                'description': 'Improve patient experience, reduce wait times, and enhance service delivery efficiency',
                'progress': 75,
                'status': 'on_track',
                'target': '95% Patient Satisfaction',
                'deadline': 'Q4 2024',
                'priority': 'high'
            },
            {
                'title': 'Augment hospital complementary Enterprises Performance',
                'description': 'Optimize ancillary services, revenue streams, and operational efficiency',
                'progress': 75,
                'status': 'on_track',
                'target': '20% Revenue Growth',
                'deadline': 'Q4 2024',
                'priority': 'medium'
            }
        ]

        for obj_data in medical_objectives:
            StrategicObjective.objects.get_or_create(
                title=obj_data['title'],
                branch=medical_services,
                defaults=obj_data
            )

        # Medical Services Key Metrics
        medical_metrics = [
            {'label': 'Patient Satisfaction', 'value': '92%', 'trend': '+5%', 'icon_name': 'IconHeartHandshake'},
            {'label': 'Staff Productivity', 'value': '87%', 'trend': '+3%', 'icon_name': 'IconUsers'},
            {'label': 'Response Time', 'value': '4.2 min', 'trend': '-15%', 'icon_name': 'IconClock'},
            {'label': 'Treatment Success', 'value': '94%', 'trend': '+8%', 'icon_name': 'IconTrendingUp'},
        ]

        for metric_data in medical_metrics:
            KeyMetric.objects.get_or_create(
                label=metric_data['label'],
                branch=medical_services,
                defaults=metric_data
            )

        # Medical Services Action Items
        medical_actions = [
            {
                'title': 'Upgrade ICU monitoring systems',
                'description': 'Install new patient monitoring equipment',
                'action_type': 'priority',
                'due_date': 'Next Month',
                'icon_name': 'IconHeartHandshake'
            },
            {
                'title': 'Recruit specialized nurses',
                'description': 'Hire additional nursing staff for ICU',
                'action_type': 'priority',
                'due_date': 'End of Quarter',
                'icon_name': 'IconUsers'
            },
            {
                'title': 'Reduced emergency response time to 4.2 minutes',
                'description': 'Successfully implemented new emergency protocols',
                'action_type': 'achievement',
                'due_date': 'Completed last month',
                'icon_name': 'IconClock'
            }
        ]

        for action_data in medical_actions:
            ActionItem.objects.get_or_create(
                title=action_data['title'],
                branch=medical_services,
                defaults=action_data
            )

        # Finance Strategic Objectives
        finance_objectives = [
            {
                'title': 'Budget Optimization',
                'description': 'Reduce operational costs while maintaining quality',
                'progress': 75,
                'status': 'on_track',
                'target': '15% Cost Reduction',
                'deadline': 'Q4 2024',
                'priority': 'high'
            },
            {
                'title': 'Revenue Growth',
                'description': 'Increase hospital revenue through strategic initiatives',
                'progress': 88,
                'status': 'exceeding_target',
                'target': '20% Revenue Increase',
                'deadline': 'Q3 2024',
                'priority': 'high'
            }
        ]

        for obj_data in finance_objectives:
            StrategicObjective.objects.get_or_create(
                title=obj_data['title'],
                branch=finance,
                defaults=obj_data
            )

        # Finance Key Metrics
        finance_metrics = [
            {'label': 'Budget Utilization', 'value': '87%', 'trend': '+5%', 'icon_name': 'IconChartPie'},
            {'label': 'Revenue Growth', 'value': '15.2%', 'trend': '+3.2%', 'icon_name': 'IconTrendingUp'},
            {'label': 'Cost Savings', 'value': '$2.1M', 'trend': '+12%', 'icon_name': 'IconCurrencyDollar'},
            {'label': 'Audit Score', 'value': '94%', 'trend': '+8%', 'icon_name': 'IconReportAnalytics'},
        ]

        # Finance Action Items
        finance_actions = [
            {
                'title': 'Implement automated billing system',
                'description': 'Deploy new automated billing and invoice processing system',
                'action_type': 'priority',
                'due_date': 'Next Month',
                'icon_name': 'IconReceipt'
            },
            {
                'title': 'Complete quarterly budget review',
                'description': 'Comprehensive review of Q3 budget performance',
                'action_type': 'priority',
                'due_date': 'End of Quarter',
                'icon_name': 'IconReportAnalytics'
            },
            {
                'title': 'Optimize vendor contracts',
                'description': 'Renegotiate key vendor contracts for better terms',
                'action_type': 'priority',
                'due_date': 'Next Quarter',
                'icon_name': 'IconCurrencyDollar'
            },
            {
                'title': 'Successfully reduced operational costs by 12%',
                'description': 'Achieved significant cost savings through process optimization',
                'action_type': 'achievement',
                'due_date': 'Completed last month',
                'icon_name': 'IconTrendingUp'
            },
            {
                'title': 'Implemented new financial dashboard',
                'description': 'Deployed real-time financial reporting dashboard',
                'action_type': 'achievement',
                'due_date': 'Completed 2 weeks ago',
                'icon_name': 'IconReportAnalytics'
            },
            {
                'title': 'Achieved 95% budget accuracy',
                'description': 'Exceeded budget forecasting accuracy targets',
                'action_type': 'achievement',
                'due_date': 'Completed this quarter',
                'icon_name': 'IconChartPie'
            }
        ]

        for action_data in finance_actions:
            ActionItem.objects.get_or_create(
                title=action_data['title'],
                branch=finance,
                defaults=action_data
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated strategic objectives data!')
        )
