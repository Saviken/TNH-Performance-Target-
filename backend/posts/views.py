from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializer import PostSerializer
from django.db.models import Q


@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


# Filter posts by department endpoints
@api_view(['GET'])
def get_ict_posts(request):
    posts = Post.objects.filter(department__iexact='ICT')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_engineering_posts(request):
    posts = Post.objects.filter(department__iexact='Engineering')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_finance_posts(request):
    posts = Post.objects.filter(department__iexact='Finance')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_healthscience_posts(request):
    posts = Post.objects.filter(department__iexact='Health-Science')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_operations_posts(request):
    posts = Post.objects.filter(department__iexact='Operations')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_riskcompliance_posts(request):
    posts = Post.objects.filter(department__iexact='Risk-Compliance')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_security_posts(request):
    posts = Post.objects.filter(department__iexact='Security')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_strategyinnovation_posts(request):
    posts = Post.objects.filter(department__iexact='Strategy-Innovation')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_supplychain_posts(request):
    posts = Post.objects.filter(department__iexact='Supply-Chain')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_humanresources_posts(request):
    posts = Post.objects.filter(department__iexact='Human-Resources')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_internalaudit_posts(request):
    posts = Post.objects.filter(department__iexact='Internal-Audit')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_legalkha_posts(request):
    posts = Post.objects.filter(department__iexact='Legal-KHA')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_medicalservices_posts(request):
    # Be flexible with branch naming (hyphen/space/case)
    posts = Post.objects.filter(
        Q(branch__name__iexact='Medical-Services') |
        Q(branch__name__iexact='Medical Services') |
        Q(branch__name__icontains='Medical')
    ).select_related('branch', 'subtitle', 'criteria')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_nursingservices_posts(request):
    posts = Post.objects.filter(department__iexact='Nursing-Services')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_operations_posts(request):
    posts = Post.objects.filter(department__iexact='Operations')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_riskcompliance_posts(request):
    posts = Post.objects.filter(department__iexact='Risk-Compliance')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_security_posts(request):
    posts = Post.objects.filter(department__iexact='Security')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_strategyinnovation_posts(request):
    posts = Post.objects.filter(department__iexact='Strategy-Innovation')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_supplychain_posts(request):
    posts = Post.objects.filter(department__iexact='Supply-Chain')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# Create your views here.
