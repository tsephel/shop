from django.urls import path
from base.views import productViews as views


urlpatterns = [
    path('', views.getProduct, name='product'),
    path('create/', views.createProduct, name='product-create'),

    path('<str:pk>/review/', views.productReview, name='product-review'),
    path('feature/', views.featureProduct, name='product-feature'),

    path('<str:pk>/', views.productDetail, name='product'),

    path('update/<str:pk>/', views.updateProduct, name='product-update'),
  
    path('delete/<str:pk>/', views.productDelete, name='product-delete'),

]